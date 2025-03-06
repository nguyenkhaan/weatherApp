const getData = async(cityName) => 
{
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=d4dec414bb32fd12d0438b3dfc638d17`; 
    let res = await fetch(url); 
    let m = -1; 
    if (res.status == 200) m = await res.json(); 
    return m; 
}
function getDate(id) 
{
    //Src: ChatGPT, này chịu không biết mấy cái hàm này... 
    const timezoneOffset = id; // Lệch 25200 giây = UTC+7
    const now = new Date(); // Lấy thời gian hiện tại theo UTC
    const localTime = new Date(now.getTime() + timezoneOffset * 1000); // Cộng thêm 25200 giây
    const year = localTime.getUTCFullYear();
    const month = String(localTime.getUTCMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const day = String(localTime.getUTCDate()).padStart(2, '0');
    const hour = String(localTime.getUTCHours()).padStart(2, '0');
    const minute = String(localTime.getUTCMinutes()).padStart(2, '0');
    const second = String(localTime.getUTCSeconds()).padStart(2, '0');
    return {
        year: year, 
        day: day, 
        month: month, 
        hour: hour, 
        minute: minute, 
        second: second
    } 
}
var intervalID; 
function changeUI(cityName) 
{
    var list = []; 
    const headerCapital = document.querySelector('.header__capital'); 
    list.push(headerCapital); 
    const headerDateTime = document.querySelector('.header__date-time'); 
    list.push(headerDateTime); 
    const temp = document.querySelector('.temp'); 
    list.push(temp); 
    const weatherListInfo1 = document.querySelector('.weather-list-item-info1'); 
    list.push(weatherListInfo1); 
    const weatherListInfo2 = document.querySelector('.weather-list-item-info2'); 
    list.push(weatherListInfo2); 
    const weatherListInfo3 = document.querySelector('.weather-list-item-info3'); 
    const app = document.querySelector('.app'); 
    const weather = document.querySelector('.weather'); 
    list.push(weatherListInfo3); 
    if (intervalID) clearInterval(intervalID); 
    intervalID = setInterval(function() 
    {
        getData(cityName)
        .then((data) => {
            if (data != -1) 
            {
                headerCapital.innerText = data.name + ', ' + `${data.sys.country}`; 
                let date = getDate(Number(data.timezone)); 
                headerDateTime.innerText = date.day + ' / ' + date.month + ' / ' + date.year + ' - ' + date.hour + ' : ' + date.minute + ' : ' + date.second; 
                let t = Number(Math.floor(data.main.temp - 273.15)); 
                temp.innerText =  t + '°C'; 
                weatherListInfo1.innerText = Number(Math.floor(data.visibility)) + ' (m)'; 
                weatherListInfo2.innerText = Number(Math.floor(data.wind.speed)) + ' (m/s)'; 
                weatherListInfo3.innerText = Number(Math.floor(data.main.humidity)) + ' (%)';
                app.classList.remove('background--hot' , 'background--fall' , 'background--cold' , 'background--verycold'); 
                weather.classList.remove('background--hot' , 'background--fall' , 'background--cold' , 'background--verycold'); 
                if (t <= 10) {
                    app.classList.add('background--verycold'); 
                    weather.classList.add('background--verycold'); 
                }
                else if (t > 10 && t <= 20) {
                    app.classList.add('background--cold'); 
                    weather.classList.add('background--cold'); 
                }
                else if (t > 20 && t <= 28) {
                    app.classList.add('background--fall'); 
                    weather.classList.add('background--fall'); 
                }
                else {
                    app.classList.add('background--hot'); 
                    weather.classList.add('background--hot'); 
                }  
            }
            else 
            {
                for (let i of list) i.innerText = "None"; 
                alert('City No Found'); 
                clearInterval(intervalID); 
            }
        })
    },1000); 
    /* 
    getData(cityName)
    .then((data) => {
        if (data != -1) 
        {
            headerCapital.innerText = data.name + ', ' + `${data.sys.country}`; 
            let date = getDate(Number(data.timezone)); 
            headerDateTime.innerText = date.day + ' / ' + date.month + ' / ' + date.year + ' - ' + date.hour + ' : ' + date.minute + ' : ' + date.second; 
            let t = Number(Math.floor(data.main.temp - 273.15)); 
            temp.innerText =  t + '°C'; 
            weatherListInfo1.innerText = Number(Math.floor(data.visibility)) + ' (m)'; 
            weatherListInfo2.innerText = Number(Math.floor(data.wind.speed)) + ' (m/s)'; 
            weatherListInfo3.innerText = Number(Math.floor(data.main.humidity)) + ' (%)';
            app.classList.remove('background--hot' , 'background--fall' , 'background--cold' , 'background--verycold'); 
            weather.classList.remove('background--hot' , 'background--fall' , 'background--cold' , 'background--verycold'); 
            if (t <= 10) {
                app.classList.add('background--verycold'); 
                weather.classList.add('background--verycold'); 
            }
            else if (t > 10 && t <= 20) {
                app.classList.add('background--cold'); 
                weather.classList.add('background--cold'); 
            }
            else if (t > 20 && t <= 28) {
                app.classList.add('background--fall'); 
                weather.classList.add('background--fall'); 
            }
            else {
                app.classList.add('background--hot'); 
                weather.classList.add('background--hot'); 
            }  
        }
        else 
        {
            for (let i of list) i.innerText = "None"; 
            alert('City No Found'); 
        }
    })
    */ 
}
function main() 
{
    const input = document.querySelector('.header__input'); 
    input.addEventListener('keydown', function(e) {
        if (e.code === 'Enter') {
            const v = input.value.trim(); 
            changeUI(v); 
        }
    })
}
const initialHeight = window.innerHeight;

window.addEventListener("resize", () => {
    if (window.innerHeight < initialHeight * 0.7) {
        document.body.classList.add("keyboard-open"); // Bàn phím xuất hiện
    } else {
        document.body.classList.remove("keyboard-open"); // Bàn phím đóng
    }
});

main(); 
