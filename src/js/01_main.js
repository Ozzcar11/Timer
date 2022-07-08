const buttonStart = document.querySelector('.stopwatch-tile__btnstart')
const buttonLap = document.querySelector('.stopwatch-tile__btnlap')
const buttonPause = document.querySelector('.stopwatch-tile__btnpause')
const buttonRestart = document.querySelector('.stopwatch-tile__btnrestart')
const stopwatchMinutes = document.querySelector('.minutes')
const stopwatchSeconds = document.querySelector('.seconds')
const stopwatchMSeconds = document.querySelector('.mseconds')
const tileButtons = document.querySelector('.stopwatch-tile__buttons')
const tileList = document.querySelector('.stopwatch-tile__list')

tileButtons.addEventListener('click', watchButtons)

let timerId
let lapNumb = 0

function watchButtons(e) {
   const buttonTarget = e.target
   const fixedDate = new Date()
   const stranim = document.querySelectorAll('.stranim')
   const buttonSwitch = document.querySelectorAll('.btn-switch')

   switch (buttonTarget.textContent) {
      case 'Start':
         buttonTarget.style.display = 'none'
         buttonSwitch.forEach(item => item.style.display = 'block')
         timerId = setInterval(timer, 100, fixedDate)
         stranim.forEach(item => item.classList.add('animation-minhand'))
         break
      case 'Lap':
         const tileListElemCount = tileList.childElementCount
         
         if (tileListElemCount > 2) tileList.children[2].classList.remove('show')
         if (tileListElemCount > 3) tileList.lastElementChild.remove()

         const tileTime = document.querySelector('.stopwatch-tile__time')
         const lapTime = stopwatchMinutes.textContent + ':' + stopwatchSeconds.textContent + '.' + stopwatchMSeconds.textContent
         lapNumb++
         
         const previosDiff = tileTime !== null ? tileTime.dataset.time : tileList.dataset.gap
         tileList.insertAdjacentHTML('afterbegin', generateItem(lapNumb, lapTime))
         document.querySelector('.stopwatch-tile__time').dataset.time = tileList.dataset.gap

         setTimeout(() => {
            tileList.firstElementChild.classList.add('show')
         }, 10)

         const diffMin = document.querySelector('.diff-min')
         const diffSec = document.querySelector('.diff-sec')
         const diffMSec = document.querySelector('.diff-msec')
         const lapDiff = tileList.dataset.gap - previosDiff

         millisRound(lapDiff, diffMin, diffSec, diffMSec)
         break
      case 'Pause':
         timerId = clearInterval(timerId)
         stranim.forEach(item => item.style.animationPlayState = 'paused')
         buttonPause.style.display = 'none'
         buttonRestart.style.display = 'block'
         break
      case 'Restart':
         buttonTarget.style.display = 'none'
         buttonSwitch.forEach(item => item.style.display = 'none')
         buttonStart.style.display = 'block'
         stranim.forEach(item => item.remove())
         document.querySelector('.stopwatch__bg').insertAdjacentHTML('afterbegin', '<div class="stopwatch__minutes stranim"></div>')
         document.querySelector('.stopwatch__mini').insertAdjacentHTML('afterbegin', '<div class="stopwatch__sec stranim"></div>')
         stopwatchMinutes.textContent = '00'
         stopwatchSeconds.textContent = '00'
         stopwatchMSeconds.textContent = '0'

         lapNumb = 0
         tileList.innerHTML = ''
         break
   }
}

function generateItem(numb, time) {
   return `
   <div class="stopwatch-tile__item fade">
      <div class="stopwatch-tile__lap">Lap<span class="lapnumb">${numb}</span></div>
      <div class="stopwatch-tile__time" data-time="0">${time}</div>
      <div class="stopwatch-tile__diff">+<span class="diff-min">00</span>:<span class="diff-sec">00</span>.<span class="diff-msec">0</span></div>
   </div>
   `
}

function timer(fixedDate) {
   const nowDate = new Date()
   const gap = nowDate - fixedDate

   tileList.dataset.gap = gap

   millisRound(gap, stopwatchMinutes, stopwatchSeconds, stopwatchMSeconds)
}

function millisRound(msec, firsElem, secondElem, thirdElem) {
   const minutesRound = Math.floor(msec / 1000 / 60)
   const secondsRound = Math.floor(msec / 1000) % 60

   if (minutesRound < 10) {
      firsElem.textContent = '0' + minutesRound
   }  else {
      firsElem.textContent = minutesRound
   }

   if (secondsRound < 10) {
      secondElem.textContent = '0' + secondsRound
   } else {
      secondElem.textContent = secondsRound
   }
   thirdElem.textContent = Math.floor(msec / 100) % 10
}