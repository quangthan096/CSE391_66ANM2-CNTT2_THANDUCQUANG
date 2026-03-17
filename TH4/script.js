const nameInput = document.getElementById("name")
const scoreInput = document.getElementById("score")
const tableBody = document.getElementById("tableBody")
const stats = document.getElementById("stats")

const searchInput = document.getElementById("search")
const rankFilter = document.getElementById("rankFilter")
const sortScore = document.getElementById("sortScore")

let students = []
let filteredStudents = []

let sortAsc = true

document.getElementById("addBtn").addEventListener("click", addStudent)

scoreInput.addEventListener("keyup", function (e) {

    if (e.key === "Enter") {
        addStudent()
    }

})

searchInput.addEventListener("input", applyFilters)

rankFilter.addEventListener("change", applyFilters)

sortScore.addEventListener("click", function () {

    sortAsc = !sortAsc

    sortScore.textContent = sortAsc ? "Điểm ▲" : "Điểm ▼"

    applyFilters()

})

function addStudent() {

    const name = nameInput.value.trim()
    const score = Number(scoreInput.value)

    if (name === "" || isNaN(score) || score < 0 || score > 10) {
        alert("Dữ liệu không hợp lệ")
        return
    }

    students.push({ name, score })

    nameInput.value = ""
    scoreInput.value = ""

    applyFilters()

}

function getRank(score) {

    if (score >= 8.5) return "Giỏi"
    if (score >= 7) return "Khá"
    if (score >= 5) return "Trung bình"
    return "Yếu"

}

function applyFilters() {

    const keyword = searchInput.value.toLowerCase()
    const rank = rankFilter.value

    filteredStudents = students.filter(s => {

        let matchName = s.name.toLowerCase().includes(keyword)

        let matchRank = rank === "all" || getRank(s.score) === rank

        return matchName && matchRank

    })

    filteredStudents.sort((a, b) => {

        return sortAsc ? a.score - b.score : b.score - a.score

    })

    renderTable()

}

function renderTable() {

    tableBody.innerHTML = ""

    if (filteredStudents.length === 0) {

        tableBody.innerHTML = `<tr><td colspan="5">Không có kết quả</td></tr>`
        return

    }

    filteredStudents.forEach((s, index) => {

        const tr = document.createElement("tr")

        if (s.score < 5) {
            tr.classList.add("low")
        }

        tr.innerHTML = `
<td>${index + 1}</td>
<td>${s.name}</td>
<td>${s.score}</td>
<td>${getRank(s.score)}</td>
<td><button class="delete-btn" data-index="${students.indexOf(s)}">Xóa</button></td>
`

        tableBody.appendChild(tr)

    })

    updateStats()

}

tableBody.addEventListener("click", function (e) {

    if (e.target.classList.contains("delete-btn")) {

        const index = e.target.dataset.index

        students.splice(index, 1)

        applyFilters()

    }

})

function updateStats() {

    const total = students.length

    if (total === 0) {

        stats.textContent = "Chưa có sinh viên"
        return

    }

    let sum = students.reduce((a, b) => a + b.score, 0)

    let avg = (sum / total).toFixed(2)

    stats.textContent = `Tổng sinh viên: ${total} | Điểm TB: ${avg}`

}