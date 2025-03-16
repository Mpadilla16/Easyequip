document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.toggle-button').forEach(button => {
      button.addEventListener('click', () => {
        const content = button.nextElementSibling;
        const icon = button.querySelector('.toggle-icon');
  
        if (content.style.display === 'none' || content.style.display === '') {
          content.style.display = 'block';
          icon.textContent = '+';
        } else {
          content.style.display = 'none';
          icon.textContent = '+';
        }
      });
    });
  });
  