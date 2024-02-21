const rangeInputs = document.querySelectorAll('input[type="range"]')
function handleInputChange(e) {
  let target = e.target
  const min = target.min
  const max = target.max
  const val = target.value
  target.style.backgroundSize = (val - min) * 100 / (max - min) + '%'
}

rangeInputs.forEach(input => {
  input.addEventListener('input', handleInputChange)
})

