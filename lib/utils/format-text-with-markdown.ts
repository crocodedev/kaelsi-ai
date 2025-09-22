export const formatTextWithMarkdown = (text: string) => {
    if (!text) return '';
    
    return text
        // Жирный текст: **текст** -> <strong>текст</strong>
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Курсив: *текст* -> <em>текст</em>
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Альтернативный синтаксис курсива: _текст_ -> <em>текст</em>
        .replace(/_(.*?)_/g, '<em>$1</em>');
};