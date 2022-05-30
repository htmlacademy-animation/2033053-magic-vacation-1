module.exports = function (element = '', option = {}, delay = 0, duration = 350) {
    element = typeof element === 'string' ? document.querySelector(element) : element
    let {name, printingOrder, delay: optionDelay = 0, duration: ortionDuration} = option
    let elementCols = null
    if(element) {
        if(element.querySelectorAll('.animation-text').length >= 1) {
            elementCols = element.querySelectorAll('.animation-text')
        } else {
            elementCols = [element]
        }

        elementCols.forEach((row, idxRow) => {
            let htmlForElem = ''
            // Обёртывает каждую букву в строке в span
            row.innerText.trim().split(/\s+/g).forEach((word, idxWord) => {
                let htmlForWord = ''
                let lastOrder = null
                word.split('').forEach((letter, i) => {
                    // устанавливает порядок появления букв, если он указан, то по указанномму.
                    // иначе рандомно, но без повторений у соседних букв 
                    let order = null
                    let timingFunction = ''
                    let randomNumber = null
                    do {
                        randomNumber = Math.floor(Math.random() * 4 + 1)
                    } while (randomNumber === lastOrder)
                    order = randomNumber
                    lastOrder = order

                    timingFunction = `cubic-bezier(
                        .${order === 5 ?  order * 2 - 5 : order * 2 - 2},
                        .${order === 5 ? order * 2 - 3: order * 2 - 0},
                        .${order === 5 ? order * 2 - 2 : order * 2 - 2}, 1)`

                    animationDelay = idxRow === 0 ? `${optionDelay}ms` : `${((idxRow + 1) * optionDelay * 0.75)}ms`
                    animation = `animation: ${name} ${ortionDuration}ms ${animationDelay} ${timingFunction} forwards`
                    // console.log('i !== word.length - 1', i !== word.length - 1);
                    i !== word.length - 1 ?
                    htmlForWord += `<span class="letter" style="${animation}">${letter}</span>` :
                    // htmlForWord += `<span class="letter" style="opasity: 0;">t</span>`
                    htmlForWord += `<span class="letter" style="${animation}">${letter}</span><span class="letter space" style="opasity: 0;">t</span>`
                    // console.log('htmlForWord', htmlForWord);
                })
                htmlForElem += `<span class="word">${htmlForWord}</span>`
                return htmlForWord
            })            
            row.innerHTML = htmlForElem
        })
    }
}