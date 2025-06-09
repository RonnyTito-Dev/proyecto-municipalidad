import React, { useState, useEffect, useRef, useCallback } from 'react';
import './AsistentePage.css';
import Swal from 'sweetalert2';

const API_BASE_URL = 'http://localhost:8000';

const AsistentePage = () => {
  // Estados
  const [chatHistory, setChatHistory] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [useBdToggle, setUseBdToggle] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showRetrainModal, setShowRetrainModal] = useState(false);
  const [showMicPermissionModal, setShowMicPermissionModal] = useState(false);
  const [backendStatus, setBackendStatus] = useState('Conectando...');

  // Refs
  const chatMessagesRef = useRef(null);
  const messageInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);

  // Función para mostrar alertas con SweetAlert2
  const showAlert = (title, text, icon, confirmButtonText = 'Aceptar') => {
    return Swal.fire({
      title,
      text,
      icon,
      confirmButtonText
    });
  };

  // Verificar estado del backend
  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/status`);
        const data = await response.json();
        setBackendStatus(data.status === 'ok' ? 'Conectado' : 'Error al conectar');
      } catch (error) {
        console.error('Error verificando backend:', error);
        setBackendStatus('Error al conectar');
      }
    };
    checkBackendStatus();
  }, []);

  // Efectos para UI
  useEffect(() => {
    if (messageInputRef.current) {
      messageInputRef.current.style.height = 'auto';
      messageInputRef.current.style.height = `${Math.min(messageInputRef.current.scrollHeight, 120)}px`;
      setCharCount(messageInputRef.current.value.length);
    }
  }, [messageInput]);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatHistory, isLoading]);

  // Configuración de reconocimiento de voz
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'es-ES';

      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onresult = (e) => {
        setMessageInput(e.results[0][0].transcript);
        stopVoiceRecognition();
      };
      recognitionRef.current.onerror = (e) => {
        console.error('Error en reconocimiento:', e.error);
        showAlert('Error', 'Error en el reconocimiento de voz', 'error');
        stopVoiceRecognition();
      };
      recognitionRef.current.onend = stopVoiceRecognition;
    }
  }, []);

  // Función principal para enviar mensajes
  const sendMessage = useCallback(async () => {
    const message = messageInput.trim();
    if (!message || isLoading) return;

    setChatHistory(prev => [...prev, [message, '']]);
    setMessageInput('');
    setIsLoading(true);

    try {
      const requestBody = {
        pregunta: message,
        usar_bd: useBdToggle, // Envía true o false según el estado del toggle
        chat_history: chatHistory
      };

      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) throw new Error('Error en la respuesta');

      const data = await response.json();
      setChatHistory(prev => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1][1] = data.respuesta || 'Sin respuesta';
        return newHistory;
      });
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      setChatHistory(prev => prev.slice(0, prev.length - 1));
      showAlert('Error', 'Error al enviar el mensaje', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [messageInput, isLoading, useBdToggle, chatHistory]);

  // Manejo de archivos
  const handleFileSelection = (e) => {
    const files = Array.from(e.target.files).filter(file => {
      const validTypes = [
        'text/plain', 'application/pdf', 
        'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/json'
      ];
      
      if (!validTypes.includes(file.type)) {
        showAlert('Error', `Tipo no soportado: ${file.name}`, 'error');
        return false;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        showAlert('Error', `Archivo muy grande: ${file.name} (máx. 10MB)`, 'error');
        return false;
      }
      
      return true;
    });

    files.forEach(uploadFile);
  };

  const uploadFile = async (file) => {
    const fileId = `${Date.now()}-${file.name}`;
    setUploadedFiles(prev => [...prev, { id: fileId, name: file.name, size: file.size, type: file.type, uploading: true }]);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/upload-file`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Error al subir');

      const data = await response.json();
      setUploadedFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, id: data.file_id || fileId, uploading: false } : f
      ));
      showAlert('Éxito', `Archivo subido: ${file.name}`, 'success');
    } catch (error) {
      console.error('Error subiendo archivo:', error);
      setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
      showAlert('Error', `Error al subir ${file.name}`, 'error');
    }
  };

  const removeFile = async (fileId) => {
    try {
      await fetch(`${API_BASE_URL}/remove-file/${fileId}`, { method: 'DELETE' });
      setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
      showAlert('Éxito', 'Archivo eliminado', 'success');
    } catch (error) {
      console.error('Error eliminando archivo:', error);
      showAlert('Error', 'Error al eliminar archivo', 'error');
    }
  };

  // Reconocimiento de voz
  const toggleVoiceRecognition = () => {
    if (!recognitionRef.current) {
      showAlert('Error', 'Reconocimiento de voz no disponible', 'error');
      return;
    }
    isListening ? stopVoiceRecognition() : startVoiceRecognition();
  };

  const startVoiceRecognition = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error accediendo al micrófono:', error);
      setShowMicPermissionModal(true);
    }
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current && isListening) recognitionRef.current.stop();
    setIsListening(false);
  };

  const requestMicPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setShowMicPermissionModal(false);
      startVoiceRecognition();
    } catch (error) {
      showAlert('Error', 'No se obtuvieron permisos', 'error');
      setShowMicPermissionModal(false);
    }
  };

  // Reentrenamiento del modelo
  const confirmRetrain = async () => {
    const result = await showAlert(
      'Confirmar reentrenamiento',
      '¿Estás seguro de querer reentrenar el modelo? Este proceso puede tardar varios minutos.',
      'warning',
      'Sí, reentrenar'
    );
    
    if (result.isConfirmed) {
      retrainModel();
    }
  };

  const retrainModel = async () => {
    setShowRetrainModal(false);
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/reentrenar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Error en la respuesta');

      const data = await response.json();
      showAlert('Éxito', data.mensaje || 'Modelo reentrenado correctamente', 'success');
    } catch (error) {
      console.error('Error reentrenando:', error);
      showAlert('Error', 'Error al reentrenar el modelo', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Renderizado
  return (
    <div className="container">
      {/* Header y controles */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <i className="fas fa-robot"></i>
            <h1>Asistente de Gestión Ciudadana</h1>
          </div>
          <div className="status-indicator">
            <div className={`status-dot ${backendStatus === 'Conectado' ? 'connected' : 'error'}`} />
            <span className="status-text">{backendStatus}</span>
          </div>
        </div>
      </header>

      <div className="controls-panel">
        <div className="control-group">
          <label className="switch">
            <input
              type="checkbox"
              checked={useBdToggle}
              onChange={() => setUseBdToggle(!useBdToggle)}
            />
            <span className="slider round"></span>
          </label>
          <span className={`control-label ${useBdToggle ? 'active' : ''}`}>
            {useBdToggle ? 'Usando Base de Datos' : 'Base de Datos Desactivada'}
          </span>
          <div className="tooltip">
            <i className="fas fa-info-circle"></i>
            <span className="tooltiptext">
              {useBdToggle 
                ? 'Activado: Las consultas usarán información de la base de datos' 
                : 'Desactivado: Solo se usará el conocimiento general del modelo'}
            </span>
          </div>
        </div>

        <button onClick={() => confirmRetrain()} className="retrain-btn">
          <i className="fas fa-sync-alt"></i>
          <span>Reentrenar Modelo</span>
        </button>
      </div>

      {/* Área de chat */}
      <div className="chat-container">
        <div ref={chatMessagesRef} className="chat-messages">
          <div className="message bot-message welcome-message">
            <div className="message-avatar">
              <i className="fas fa-robot"></i>
            </div>
            <div className="message-content">
              <p>¡Hola! Soy tu asistente de gestión ciudadana. ¿En qué puedo ayudarte hoy?</p>
            </div>
          </div>

          {chatHistory.map(([question, answer], index) => (
            <React.Fragment key={index}>
              <div className="message user-message">
                <div className="message-avatar">
                  <i className="fas fa-user"></i>
                </div>
                <div className="message-content">
                  <p>{question}</p>
                </div>
              </div>
              
              {answer && (
                <div className="message bot-message">
                  <div className="message-avatar">
                    <i className="fas fa-robot"></i>
                  </div>
                  <div className="message-content">
                    <p>{answer}</p>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}

          {isLoading && (
            <div className="loading-indicator">
              <div className="typing-animation">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span>El asistente está pensando...</span>
            </div>
          )}
        </div>
      </div>

      {/* Área de entrada */}
      <div className="input-area">
        {uploadedFiles.length > 0 && (
          <div className="file-upload-area">
            <h5>Archivos subidos:</h5>
            <div className="uploaded-files">
              {uploadedFiles.map(file => (
                <div key={file.id} className={`file-item ${file.type.includes('pdf') ? 'file-item-pdf' : 
                  file.type.includes('word') ? 'file-item-doc' : 
                  file.type.includes('sheet') ? 'file-item-excel' : 'file-item-txt'}`}>
                  {file.uploading ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : (
                    <i className={`fas ${
                      file.type.includes('pdf') ? 'fa-file-pdf' :
                      file.type.includes('word') ? 'fa-file-word' :
                      file.type.includes('sheet') ? 'fa-file-excel' : 'fa-file-alt'
                    }`}></i>
                  )}
                  <span className="file-name">{file.name}</span>
                  {!file.uploading && (
                    <>
                      <span className="file-size">
                        {file.size > 1024 * 1024 
                          ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` 
                          : `${Math.round(file.size / 1024)} KB`}
                      </span>
                      <button onClick={() => removeFile(file.id)} className="remove-file-btn">
                        <i className="fas fa-times"></i>
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="input-container">
          <div className="input-tools">
            <button onClick={() => fileInputRef.current?.click()} className="tool-btn">
              <i className="fas fa-paperclip"></i>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelection}
              accept=".txt,.pdf,.doc,.docx,.csv,.xlsx,.xls,.json"
              multiple
              className="hidden-input"
            />

            <button
              id="micBtn"
              onClick={toggleVoiceRecognition}
              className={`tool-btn mic-btn ${isListening ? 'active' : ''}`}
            >
              <i className="fas fa-microphone"></i>
            </button>
          </div>

          <textarea
            ref={messageInputRef}
            rows="1"
            maxLength="1000"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Escribe tu mensaje aquí..."
            className="message-input"
          />

          <button
            onClick={sendMessage}
            disabled={isLoading || !messageInput.trim()}
            className="send-btn"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>

        {isListening && (
          <div className="voice-indicator">
            <div className="voice-animation">
              <div className="voice-wave"></div>
              <div className="voice-wave"></div>
              <div className="voice-wave"></div>
            </div>
            <span>Escuchando...</span>
            <button onClick={stopVoiceRecognition} className="stop-voice-btn">
              <i className="fas fa-stop"></i>
            </button>
          </div>
        )}

        <div className="input-footer">
          <div className="char-counter">
            <span>{charCount}</span>/1000
          </div>
        </div>
      </div>

      {/* Modal de permisos de micrófono */}
      {showMicPermissionModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>
                <i className="fas fa-microphone"></i> Permisos de micrófono
              </h3>
              <button onClick={() => setShowMicPermissionModal(false)} className="close-btn">
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p>Necesitamos acceso a tu micrófono para el reconocimiento de voz.</p>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowMicPermissionModal(false)} className="btn-secondary">
                Cancelar
              </button>
              <button onClick={requestMicPermission} className="btn-primary">
                Permitir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AsistentePage;