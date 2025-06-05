const textFormatter = {
  trim(text) {
    if (typeof text !== 'string') return text;
    return text.trim();
  },

  toUpperCase(text) {
    if (typeof text !== 'string') return text;
    return text.trim().toUpperCase();
  },

  toLowerCase(text) {
    if (typeof text !== 'string') return text;
    return text.trim().toLowerCase();
  },

  toTitleCase(text) {
    if (typeof text !== 'string') return text;
    // Trim primero
    const trimmed = text.trim();
    // Capitalizar la primera letra de cada palabra
    return trimmed.replace(/\w\S*/g, (word) =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );
  }
};

module.exports = textFormatter;
