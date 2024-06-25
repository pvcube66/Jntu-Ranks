document.addEventListener('DOMContentLoaded', function() {
    const rollForm = document.getElementById('rollForm');
    rollForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const sequence = document.getElementById('sequence').value;
        const startRoll = document.getElementById('startRoll').value;
        const endRoll = document.getElementById('endRoll').value;
        const queryString = `results.html?sequence=${encodeURIComponent(sequence)}&startRoll=${encodeURIComponent(startRoll)}&endRoll=${encodeURIComponent(endRoll)}`;
        window.location.href = queryString;
    });
});
