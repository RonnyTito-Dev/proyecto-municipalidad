import React, { useState } from 'react';

const InicioPage = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredMember, setHoveredMember] = useState(null);

  const teamMembers = [
    {
      name: "Fernando Rodriguez Huanca",
      role: "Team Leader",
      color: "linear-gradient(135deg, #6366f1, #8b5cf6)",
      icon: "👨‍💼"
    },
    {
      name: "Ronal Tito Paucar",
      role: "Full Stack Developer",
      color: "linear-gradient(135deg, #3b82f6, #6366f1)",
      icon: "💻"
    },
    {
      name: "Erickson Daniel Riveros Vera",
      role: "Frontend Specialist",
      color: "linear-gradient(135deg, #8b5cf6, #a855f7)",
      icon: "🎨"
    },
    {
      name: "Joseph Amos Taco Puma",
      role: "Backend Engineer",
      color: "linear-gradient(135deg, #2563eb, #4f46e5)",
      icon: "⚙️"
    },
    {
      name: "Luis Daniel Ari Ari",
      role: "DevOps & QA",
      color: "linear-gradient(135deg, #7c3aed, #9333ea)",
      icon: "🚀"
    }
  ];

  const stats = [
    { label: "Proyectos Completados", value: "12", icon: "🏆" },
    { label: "Miembros del Equipo", value: "5", icon: "👥" },
    { label: "Tecnologías Dominadas", value: "8+", icon: "⭐" },
    { label: "Objetivos Alcanzados", value: "95%", icon: "🎯" }
  ];

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: 'Arial, sans-serif',
      color: '#111827'
    },
    header: {
      textAlign: 'center',
      padding: '3rem 1.5rem',
      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
      color: 'white',
      borderRadius: '0 0 2rem 2rem',
      marginBottom: '2rem',
      boxShadow: '0 10px 25px rgba(59, 130, 246, 0.2)',
      animation: 'fadeIn 0.8s ease-out'
    },
    mainTitle: {
      fontSize: '3rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
      animation: 'slideDown 1s ease-out'
    },
    subtitle: {
      fontSize: '1.25rem',
      opacity: 0.9,
      maxWidth: '32rem',
      margin: '0 auto',
      lineHeight: '1.6',
      animation: 'slideUp 1s ease-out 0.3s both'
    },
    statsContainer: {
      padding: '2rem 1.5rem',
      marginBottom: '3rem'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      maxWidth: '72rem',
      margin: '0 auto'
    },
    statCard: {
      background: '#f0f9ff',
      borderRadius: '1rem',
      padding: '1.5rem',
      border: '1px solid #e0f2fe',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      animation: 'fadeInUp 0.6s ease-out both'
    },
    statCardHover: {
      transform: 'translateY(-10px) scale(1.02)',
      boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)',
      background: 'linear-gradient(135deg, #e0f2fe, #f0f9ff)'
    },
    statIcon: {
      fontSize: '2.5rem',
      marginBottom: '0.5rem',
      display: 'block',
      animation: 'bounce 2s infinite'
    },
    statValue: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#3b82f6',
      marginBottom: '0.25rem',
      animation: 'pulse 2s infinite'
    },
    statLabel: {
      fontSize: '1rem',
      color: '#64748b'
    },
    teamSection: {
      padding: '2rem 1.5rem 3rem',
      background: '#f8fafc'
    },
    teamTitle: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#1e1b4b',
      marginBottom: '3rem',
      position: 'relative',
      animation: 'fadeIn 1s ease-out'
    },
    teamTitleUnderline: {
      width: '100px',
      height: '4px',
      background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
      margin: '1rem auto',
      borderRadius: '2px',
      animation: 'expandWidth 1s ease-out 0.5s both'
    },
    teamGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem',
      maxWidth: '72rem',
      margin: '0 auto'
    },
    memberCard: {
      borderRadius: '1.5rem',
      padding: '2rem',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.4s ease',
      cursor: 'pointer',
      color: '#ffffff',
      textAlign: 'center',
      animation: 'fadeInScale 0.6s ease-out both',
      position: 'relative',
      overflow: 'hidden'
    },
    memberCardHover: {
      transform: 'translateY(-15px) scale(1.05)',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)'
    },
    memberIcon: {
      fontSize: '4rem',
      marginBottom: '1rem',
      display: 'block',
      transition: 'transform 0.3s ease',
      animation: 'float 3s ease-in-out infinite'
    },
    memberIconHover: {
      transform: 'scale(1.2) rotate(10deg)',
      animation: 'spin 0.5s ease-in-out'
    },
    memberName: {
      fontSize: '1.3rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)'
    },
    memberRole: {
      fontSize: '0.95rem',
      opacity: 0.9,
      background: 'rgba(255, 255, 255, 0.2)',
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      display: 'inline-block',
      marginTop: '0.5rem',
      backdropFilter: 'blur(10px)'
    },
    footer: {
      textAlign: 'center',
      padding: '2rem 1.5rem',
      color: '#64748b',
      fontSize: '1rem',
      background: 'linear-gradient(135deg, #f0f9ff, #e9d5ff)',
      marginTop: '2rem',
      animation: 'fadeIn 1s ease-out'
    }
  };

  // CSS Keyframes
  const keyframes = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes fadeInUp {
      from { 
        opacity: 0; 
        transform: translateY(30px); 
      }
      to { 
        opacity: 1; 
        transform: translateY(0); 
      }
    }

    @keyframes fadeInScale {
      from { 
        opacity: 0; 
        transform: scale(0.8); 
      }
      to { 
        opacity: 1; 
        transform: scale(1); 
      }
    }

    @keyframes slideDown {
      from { 
        opacity: 0; 
        transform: translateY(-50px); 
      }
      to { 
        opacity: 1; 
        transform: translateY(0); 
      }
    }

    @keyframes slideUp {
      from { 
        opacity: 0; 
        transform: translateY(30px); 
      }
      to { 
        opacity: 1; 
        transform: translateY(0); 
      }
    }

    @keyframes bounce {
      0%, 20%, 53%, 80%, 100% {
        transform: translate3d(0,0,0);
      }
      40%, 43% {
        transform: translate3d(0,-15px,0);
      }
      70% {
        transform: translate3d(0,-7px,0);
      }
      90% {
        transform: translate3d(0,-3px,0);
      }
    }

    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }

    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes expandWidth {
      from { width: 0; }
      to { width: 100px; }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.mainTitle}>Bienvenidos al Equipo</h1>
          <p style={styles.subtitle}>
            Un grupo comprometido con la excelencia, innovación y tecnología.
          </p>
        </header>

        <section style={styles.statsContainer}>
          <div style={styles.statsGrid}>
            {stats.map((stat, idx) => (
              <div 
                key={idx} 
                style={{
                  ...styles.statCard,
                  ...(hoveredCard === idx ? styles.statCardHover : {}),
                  animationDelay: `${idx * 0.1}s`
                }}
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={styles.statIcon}>{stat.icon}</div>
                <div style={styles.statValue}>{stat.value}</div>
                <div style={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.teamSection}>
          <h2 style={styles.teamTitle}>
            Nuestro Equipo
          </h2>
          <div style={styles.teamTitleUnderline}></div>
          
          <div style={styles.teamGrid}>
            {teamMembers.map((member, idx) => (
              <div 
                key={idx} 
                style={{
                  ...styles.memberCard,
                  background: member.color,
                  ...(hoveredMember === idx ? styles.memberCardHover : {}),
                  animationDelay: `${idx * 0.15}s`
                }}
                onMouseEnter={() => setHoveredMember(idx)}
                onMouseLeave={() => setHoveredMember(null)}
              >
                <div 
                  style={{
                    ...styles.memberIcon,
                    ...(hoveredMember === idx ? styles.memberIconHover : {})
                  }}
                >
                  {member.icon}
                </div>
                <div style={styles.memberName}>{member.name}</div>
                <div style={styles.memberRole}>{member.role}</div>
              </div>
            ))}
          </div>
        </section>

        <footer style={styles.footer}>
          © {new Date().getFullYear()} Equipo de Desarrollo. Todos los derechos reservados.
        </footer>
      </div>
    </>
  );
};

export default InicioPage;