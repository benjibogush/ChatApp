const emotePanel = document.getElementById('emojiPanel')
const emoteBlur = document.getElementById('emojiPanelBG')

function emojiPanelOpen() {
  emotePanel.style.display = "block"
  emoteBlur.style.display = "block"
}

function closeEmojiModal() {
  emotePanel.style.display = "none"
  emoteBlur.style.display = "none"
}
