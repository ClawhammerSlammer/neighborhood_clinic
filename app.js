console.log("Connected")
const soundURL = "https://www.freesoundslibrary.com/wp-content/uploads/2022/09/short-timpani-battle-accent.mp3"
const timeDisplay = document.querySelector("#clock-display")
const dateDisplay = document.querySelector("#date-display")

const quickSetter = document.querySelector("#quick-set")
const timerMinDisplay = document.querySelector("#timer-minutes-display")
const timerSecondsDisplay = document.querySelector("#timer-seconds-display")
const minutesUpBtn = document.querySelector("#minutes-up")
const minutesDownBtn = document.querySelector("#minutes-down")
const secondsUpBtn = document.querySelector("#seconds-up")
const secondsDownBtn = document.querySelector("#seconds-down")

const pauseBtn = document.querySelector("#pause-btn")
const startBtn = document.querySelector("#start-btn")
const resetBtn = document.querySelector("#reset-btn")

const buzzer = new Audio(soundURL)
const volumeControl = document.querySelector("#volume-value")

const timerContainer = document.querySelector("#timer-container")

// Header Section

const userSelect = document.querySelector("#title-user")
const headerTitle = document.querySelector("#header-title")

function setHeaderUser() {
    const name = this.value;
    switch (name) {
        case "John":
            headerTitle.innerText = "Mister John's Neighborhood Clinic";
            break;
        case "Alyxis":
            headerTitle.innerText = "Miss Alyxis's Neighborhood Clinic";
            break;
        case "Maria":
            headerTitle.innerText = "Miss Maria's Neighborhood Clinic";
            break;
        case "Keya":
            headerTitle.innerText = "Miss Keya's Neighborhood Clinic";
            break;
        case "Denisse":
            headerTitle.innerText = "Miss Denisse's Neighborhood Clinic"
            break;
        default:
            headerTitle.innerText = "Northwest Neighborhood Clinic"
    }
}

userSelect.addEventListener("change", setHeaderUser)



// Clock Section

function displayDateTime() {
    // Called on load, displays time and date
    const dateNow = new Date(Date.now())
    const hour = dateNow.getHours()
    let minute = dateNow.getMinutes()
    if (minute < 10) {
        minute = "0" + minute
    }
    let second = dateNow.getSeconds()
    if (second < 10) {
        second = "0" + second
    }
    const month = dateNow.getMonth()
    const day = dateNow.getDate()
    const year = dateNow.getFullYear()
    const timeHTML = `${hour}:${minute}<sup> ${second}</sup>`
    const dateHTML = `${month + 1}/${day}/${year}`
    timeDisplay.innerHTML = timeHTML
    dateDisplay.innerHTML = dateHTML

    setTimeout(displayDateTime, 1000)
}

// Timer Section

//Timer button functions
function minutesUp() {
    // Increments minutes using minuteUp button
    const minuteVal = parseInt(timerMinDisplay.innerText) + 1
    if (minuteVal < 10) {
        timerMinDisplay.innerText = "0" + `${minuteVal}`
    } else {
        timerMinDisplay.innerText = minuteVal
    }
}

function minutesDown() {
    // Decrements minutes with minuteDown button and timer function
    const minuteVal = parseInt(timerMinDisplay.innerText) - 1
    if (minuteVal < 10 && minuteVal > -1) {
        timerMinDisplay.innerText = "0" + `${minuteVal}`
    } else if (minuteVal < 0) {
        timerMinDisplay.innerText = "00"
    } else {
        timerMinDisplay.innerText = minuteVal
    }
}

function secondsDown() {
    // Decrements seconds with secondsDown button and timer function
    const secondsVal = parseInt(timerSecondsDisplay.innerText) - 1
    if (secondsVal < 0) {
        timerSecondsDisplay.innerText = "59"
    } else if (secondsVal < 10) {
        timerSecondsDisplay.innerText = "0" + `${secondsVal}`
    } else {
        timerSecondsDisplay.innerText = secondsVal
    }
}

function secondsUp() {
    // Increments seconds using secondsUp button
    const secondsVal = parseInt(timerSecondsDisplay.innerText) + 1
    if (secondsVal < 10) {
        timerSecondsDisplay.innerText = "0" + `${secondsVal}`
    } else if (secondsVal > 59) {
        timerSecondsDisplay.innerText = "00"
    } else {
        timerSecondsDisplay.innerText = secondsVal
    }
}

// Global variables for use in timer function
let countDownCounter = 0
let pause = false
let pauseCounter = 0
let flashInterval
let playInterval
let resetVals = ["00", "00"]
let resetCounter = 0

function countDown() {
    // Count down timer and activate alarm at end
    if (countDownCounter !== 0) {
        countDownCounter++
        let secondsVal = parseInt(timerSecondsDisplay.innerText)
        let minuteVal = parseInt(timerMinDisplay.innerText)
        if (minuteVal !== 0) {
            if (secondsVal !== 0) {
                secondsDown()
                return true
            } else {
                minutesDown()
                secondsDown()
                return true
            }
        } else if (secondsVal !== 0) {
            if (secondsVal > 1) {
                secondsDown()
                return true
            } else {
                secondsDown()
                setTimeout(() => {
                    [flashInterval, playInterval] = flashTimeOut()
                    countDownCounter = 0
                    return false
                }, 10)
            }
        } else {
            return false
        }
        displayDateTime()
    } else {
        countDownCounter++
        return true
    }
}

function timerCountDown() {
    // Count down timer, check if paused
    if (!pause) {
        const proceed = countDown()
        if (proceed) { setTimeout(timerCountDown, 1000) }
    }
}

function togglePause() {
    if (pause) {
        pause = false
        timerCountDown()
    } else {
        pause = true
    }
}
function playAlertSound() {
    buzzer.volume = volumeControl.value
    buzzer.play()
    return buzzer
}

function flashTimeOut() {
    // Behavior at end of timer
    document.querySelector("body").classList.toggle("bg-yellow")
    playAlertSound()
    colorFlash = setInterval(() => {
        timerContainer.classList.toggle("bg-red");
    }, 1000)
    soundFlash = setInterval(() => { playAlertSound() }, 1000)
    return [colorFlash, soundFlash]
}

function setResetValues() {
    resetVals = [timerMinDisplay.innerText, timerSecondsDisplay.innerText]
}

function setMinSecDisplays(minutes, seconds) {
    timerMinDisplay.innerText = minutes
    timerSecondsDisplay.innerText = seconds
}

function startButtonGroup() {
    if (pauseCounter == 0) {
        setResetValues()
    }
    pause = false
    timerCountDown()
}

function pauseButtonGroup() {
    togglePause()
    pauseCounter++
}

function resetButtonGroup() {
    clearInterval(flashInterval);
    clearInterval(playInterval);
    timerContainer.classList.remove("bg-red")
    document.querySelector("body").classList.remove("bg-yellow")
    setMinSecDisplays(resetVals[0], resetVals[1])
    pause = 0
    console.log("Reset clicked")
}

quickSetter.addEventListener("input", function () {
    if (this.value !== "quick") {
        timerMinDisplay.innerText = this.value
    } else {
        timerMinDisplay.innerText = "00"
    }
    this.value = "quick"
    setResetValues()
})



startBtn.addEventListener("click", startButtonGroup)
pauseBtn.addEventListener("click", pauseButtonGroup)
resetBtn.addEventListener("click", resetButtonGroup)

minutesUpBtn.addEventListener("click", () => {
    minutesUp()
    setResetValues()
})
minutesDownBtn.addEventListener("click", () => {
    minutesDown()
    setResetValues()
})
secondsUpBtn.addEventListener("click", () => {
    secondsUp()
    setResetValues()
})
secondsDownBtn.addEventListener("click", () => {
    secondsDown()
    setResetValues()
})

// ordersDisplay.addEventListener("click", function (e) {
//     console.log(e.target.parentNode)
// })

// Orders Section

const ordersDisplay = document.querySelector("#orders-display")
const submitBtn = document.querySelector("#submit-btn")
const cancelBtn = document.querySelector("#cancel-btn")
const quickProcedure = document.querySelector("#quick-procedure")
const quickMed = document.querySelector("#quick-med")
const quickDose = document.querySelector("#quick-dose")
const notesEntry = document.querySelector("#free-text")
const form = document.querySelector("form")

const injections = ["IM Deltoid", "IM Glute", "SubQ", "ID"]

function writeOrderDiv(message) {
    const messageHTML = document.createElement("div")
    messageHTML.classList.add("order-div")
    messageHTML.innerHTML = `<span><i class="fa-solid fa-stethoscope red"></i> ${message}</span><span class=\"delete-icon\"><i
    class=\"fa-solid fa-circle-xmark\"></i></span>`
    const deleteBtn = messageHTML.querySelector(".fa-circle-xmark")
    deleteBtn.addEventListener("click", () => messageHTML.remove())
    ordersDisplay.append(messageHTML)
    resetOrdersForm()
}

function writeOrdersToBox() {
    const procedure = quickProcedure.value
    const med = quickMed.value
    const dose = quickDose.value
    const notes = notesEntry.value

    if (procedure == "none" && notes == "") {
        alert("Please select a procedure or enter note!")
        return false
    } else if (procedure == "none") {
        writeOrderDiv(notes)
        return false
    }

    if (!injections.includes(procedure)) {
        console.log("Fuck you")
        if (notes == "") {
            writeOrderDiv(procedure)
            return false
        } else {
            const message = `${procedure}: <em>${notes}`
            writeOrderDiv(message)
            return false
        }
    } else {
        if (med == "none" || dose == 'none') {
            alert("Please select a medication and doseage!")
            return false
        } else if (notes !== "") {
            const message = `${procedure} - ${med} - ${dose}: <em>${notes}</em>`
            writeOrderDiv(message)
        } else {
            const message = `${procedure} - ${med} - ${dose}`
            writeOrderDiv(message)
        }
    }

    resetOrdersForm()
}

function enableInjections() {
    quickMed.disabled = false
    quickDose.disabled = false
}

function disableInjections() {
    quickMed.disabled = true
    quickDose.disabled = true
}

function resetOrdersForm() {
    disableInjections();
    form.reset()
}

quickProcedure.addEventListener("change", function () {
    const injections = ["IM Deltoid", "IM Glute", "SubQ", "ID"]
    if (injections.includes(this.value)) {
        enableInjections()
    } else {
        disableInjections()
    }
})

submitBtn.addEventListener("click", (e) => {
    e.preventDefault()
    writeOrdersToBox()
})

displayDateTime()
clearInterval(flashInterval)
clearInterval(playInterval)