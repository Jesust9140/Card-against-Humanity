document.addEventListener('DOMContentLoaded', async () => {
    try {
      const res = await fetch('/cards');
      const data = await res.json();
      const blackCard = data.black[Math.floor(Math.random() * data.black.length)];
      const whiteCards = data.white.sort(() => 0.5 - Math.random()).slice(0, 5);
  
      document.getElementById('black-card').innerText = blackCard.text;
      const whiteCardsDiv = document.getElementById('white-cards');
  
      whiteCards.forEach(card => {
        const btn = document.createElement('button');
        btn.innerText = card.text;
        btn.onclick = () => alert(`You played: ${card.text}`);
        whiteCardsDiv.appendChild(btn);
      });
    } catch (err) {
      console.error(err);
    }
  });
  