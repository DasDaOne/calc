const amount = document.getElementById("amount")
const time = document.getElementById("time")
const percentage = document.getElementById("percentage")

const loanAmount = document.getElementById("loan amount")
const overprice = document.getElementById("overprice")
const sum = document.getElementById("sum")

const sProgressbar1 = document.getElementById("sum-progress-bar-1")
const sProgressbar2 = document.getElementById("sum-progress-bar-2")

const monthlyPayment = document.getElementById("monthly-payment")
const p2 = document.getElementById("percentage2")


function calc() {
    let a = +amount.value
    let t = +time.value
    let p = +percentage.value
    let dailyPercentage = p / 365 / 100

    if(a === 0 || t === 0 || p === 0 || isNaN(a) || isNaN(t) || isNaN(p)){
        return
    }

    let r = p / 100 / 12
    let s = a * (r * ((1 + r) ** t)) / ((1 + r) ** t - 1)
    let op = (s * t) - a
    op = +op.toFixed(2)

    loanAmount.innerText = `${a}₽ - сумма кредита`
    overprice.innerText = `${op}₽ - переплата за ${t} месяцев`
    sum.innerText = `${a + op}₽ - общая сумма выплат`

    let sp2 = op / ((a + op) / 100)
    let sp1 = 100 - sp2

    sProgressbar1.setAttribute("style", `width: ${sp1}%; background: whitesmoke;`)
    sProgressbar1.innerText = sp1.toFixed(2) + "%"
    sProgressbar2.setAttribute("style", `width: ${sp2}%;; background: gold`)
    sProgressbar2.innerText = sp2.toFixed(2) + "%"

    let mp = (a + op) / t
    let mpf = mp.toFixed(2)

    monthlyPayment.innerText = `${mpf}₽`
    p = p.toFixed(2)
    p2.innerText = `${p}%`
    let date = new Date()
    let sMonth = date.getMonth()
    let year = date.getFullYear()


    let chartHolder = document.getElementById("chartHolder")
    let chart = document.getElementById("chart")
    if(chart != null){
        chart.remove()
    }
    chartHolder.insertAdjacentHTML("beforeend", `<div class="row" id="chart"></div>`)
    chart = document.getElementById("chart")
    chart.insertAdjacentHTML("beforeend", `<div class="col-md-12"><h2>${year} год</h2></div>`)
    let remains = a

    chart.insertAdjacentHTML("beforeend", `
                    <span class="col-md-2 align-middle fs-5">${getMonthFromNumber(sMonth)}</span>
                    <div class="progress col-md-9 my-auto bg-light border border-secondary p-0 ms-5" data-bs-toggle="popover" data-bs-trigger="hover focus">
                        <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                        <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>`)

    let popoverTriggers = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    let popover = new bootstrap.Popover(popoverTriggers[popoverTriggers.length - 1], {
        html: true,
        offset: [0, -100],
        title: `<h4 class="align-center my-1">${getMonthFromNumber(sMonth)} ${year}</h4>`,
        content: `<div class="row">
<div class="col-md-7 text-secondary">Платёж по основному долгу</div>
<h5 class="col-md-5 text-end">0₽</h5>
<div class="col-md-7 text-secondary">Платёж по процентам</div>
<h5 class="col-md-5 text-end">0₽</h5>
<hr class="my-1" style="height: 1rem; border-color: black">
<div class="col-md-7 text-secondary">Платёж по процентам</div>
<h5 class="col-md-5 text-end">0₽</h5>
</div>`
    })

    for(let i = 1; i < t + 1; i++){
        let month = (sMonth + i) % 12
        if(month === 0){
            year += 1
            chart.insertAdjacentHTML("beforeend", `<div class="col-md-12"><h2>${year} год</h2></div>`)
        }

        let prevPaymentDate = new Date()
        prevPaymentDate.setMonth(prevPaymentDate.getMonth() + i - 1)
        let newPaymentDate = new Date()
        newPaymentDate.setMonth(newPaymentDate.getMonth() + i)
        let days = (newPaymentDate.getTime() - prevPaymentDate.getTime()) / 86400000
        let interestRepayment = remains * dailyPercentage * days
        let bsum = mp - interestRepayment
        remains -= bsum

        let perc = mp / 100
        let bp = bsum / perc

        chart.insertAdjacentHTML("beforeend", `
                    <span class="col-md-2 align-middle fs-5">${getMonthFromNumber(month)}</span>
                    <div class="progress col-md-9 my-auto border border-secondary p-0 ms-5" style="background: gold" data-bs-toggle="popover" data-bs-trigger="hover focus">
                        <div class="progress-bar" style="width: ${bp}%; background: lightgray" role="progressbar"</div>
                    </div>`)
        popoverTriggers = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
        popover = new bootstrap.Popover(popoverTriggers[popoverTriggers.length - 1], {
            html: true,
            offset: [0, -100],
            title: `<h4 class="align-center my-1">${getMonthFromNumber(month)} ${year}</h4>`,
            content: `<div class="row">
<div class="col-md-7 text-secondary">Платёж по основному долгу</div>
<h5 class="col-md-5 text-end">${bsum.toFixed(2)}₽</h5>
<div class="col-md-7 text-secondary">Платёж по процентам</div>
<h5 class="col-md-5 text-end">${interestRepayment.toFixed(2)}₽</h5>
<hr class="my-1" style="height: 1rem; border-color: black">
<div class="col-md-7 text-secondary">Платёж по процентам</div>
<h5 class="col-md-5 text-end">${mp.toFixed(2)}₽</h5>
</div>`
        })
    }
}

function getMonthFromNumber(num) {
    let month
    switch (num)
    {
        case 0: month="Январь"; break;
        case 1: month="Февраль"; break;
        case 2: month="Март"; break;
        case 3: month="Апрель"; break;
        case 4: month="Май"; break;
        case 5: month="Июнь"; break;
        case 6: month="Июль"; break;
        case 7: month="Август"; break;
        case 8: month="Сентябрь"; break;
        case 9: month="Октябрь"; break;
        case 10: month="Ноябрь"; break;
        case 11: month="Декабрь"; break;
    }
    return month
}