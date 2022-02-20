$(document).ready(function(){

    const cityName = [];  //버튼 클릭 또는 검색바에서 입력을 하는 순간, 도시명 데이터를 수집한다.
    console.log(cityName);







    let state_icon = "";  //텍스트 아이콘을 이미지 아이콘으로 변경하는 데이터

    const w_box = `
    <li>
        <div class="top">
            <div class="cur_icon">
                <i class="wi"></i>
            </div>
            <div class="info">
                <p class="temp"><span class="degree">12</span>&nbsp;℃</p>
                <p class="interTemp">
                    최저 <span class="temp_min">9</span>℃ / 
                    최고 <span class="temp_max">15</span>℃
                </p>
                <h4>Cloud</h4>
                <p class="location"><span class="city">Busan</span>, <span class="nation">KR</span></p>
            </div>
        </div>
        <div class="bottom">
            <div class="wind">
                <i class="wi wi-strong-wind"></i>
                <p><span>0.00</span>&nbsp;m/s</p>
            </div>
            <div class="humidity">
                <i class="wi wi-humidity"></i>
                <p><span>00</span>&nbsp;%</p>
            </div>
            <div class="cloud">
                <i class="wi wi-cloudy"></i>
                <p><span>00</span>&nbsp;%</p>
            </div>
        </div>
    </li>
    `;


    function w_info(){

        $("#weather ul").empty();  //하위의 내용을 비운다.

        //cityName 이라는 배열 데이터를 기준으로 반복하여 구조(w_box)를 넣는다.
        for(v of cityName){
            $("#weather ul").append(w_box);
        }
        //첫번째 데이터가 존재한다면 두번째 버튼을 클릭했을 때, 두번을 반복을 한다. (기존 데이터인 한개의 박스가 있는 것에 추가로 두개의 박스가 추가된다.)
        //구성 완료된 시점

        $("#weather li").each(function(index){
            //index : 순차적 접근 과정에서 인덱스번호를 반환
        

            $.ajax({
                url : `https://api.openweathermap.org/data/2.5/weather?q=${cityName[index]}&appid=df280621b01a43548a7bf3527b02364b`,
                dataType : "json",
                success : function(data){
                    //console.log(data);
                    const weather = data.weather[0].main;
                    console.log("현재 날씨 : " + weather);
                    const temp = Math.round(data.main.temp - 273.15);
                    console.log("현재 온도 : " + temp);
                    const min_temp = Math.round(data.main.temp_min - 273.15);
                    console.log("최저 온도 : " + min_temp);
                    const max_temp = Math.round(data.main.temp_max - 273.15);
                    console.log("최고 온도 : " + max_temp);
                    const city = data.name;
                    console.log("도시명 : " + city);
                    const nation = data.sys.country;
                    console.log("국가명 : " + nation);
                    const wind = data.wind.speed;
                    console.log("현재 풍속 : " + wind);
                    const humidity = data.main.humidity;
                    console.log("현재 습도 : " + humidity);
                    const cloud = data.clouds.all;
                    console.log("구름 양 : " + cloud);


                    //텍스트화된 날씨(변수명 : weather) 데이터를 이미지 아이콘으로 변경

                    if(weather == "Clear") state_icon = "wi-day-sunny";
                    else if(weather == "Clouds") state_icon = "wi-cloudy";
                    else if(weather == "Rain") state_icon = "wi-rain";
                    else if(weather == "Snow") state_icon = "wi-snow";
                    else if(weather == "Mist") state_icon = "wi-fog";
                    else if(weather == "Cloud") state_icon = "wi-cloud";

                    $("#weather li").eq(index).find(".cur_icon i").addClass(state_icon);
                    $("#weather li").eq(index).find(".temp .degree").text(temp);
                    $("#weather li").eq(index).find(".temp_min").text(min_temp);
                    $("#weather li").eq(index).find(".temp_max").text(max_temp);
                    $("#weather li").eq(index).find("h4").text(weather);
                    $("#weather li").eq(index).find(".city").text(city);
                    $("#weather li").eq(index).find(".nation").text(nation);
                    $("#weather li").eq(index).find(".wind span").text(wind);
                    $("#weather li").eq(index).find(".humidity span").text(humidity);
                    $("#weather li").eq(index).find(".cloud span").text(cloud);
                }
            });  //ajax 종료
        });  //each문 종료
    }




    $(document).on("click", ".cities button", function(){
        const city_txt = $(this).text();  //클릭한 버튼의 텍스트를 추출
        console.log(city_txt);
        cityName.unshift(city_txt);  //cityName이라는 배열 데이터의 첫번째 자리에 데이터를 추가한다.
        console.log(cityName);
        $(this).remove();  //클릭한 버튼은 제거된다.
        w_info();  //함수 호출
    });
    

    function searching(){
        const search_val = $("#search_box").val();
        if(search_val.trim() == ""){  // 검색어의 전후 공백을 제거해보니 값이 없더라(최소 공백만 넣은 상태)
            alert("검색어를 입력바랍니다.");
            $(".search_box").focus();
        }else{
            cityName.unshift(search_val);
            w_info();
        }
    }

    $(".search button").click(function(){
        searching();
    });

    $(".search").keydown(function(e){
        if(e.keyCode == "13"){
            searching();
        }
    });

    navigator.geolocation.getCurrentPosition(function(position){
        const latitude = position.coords.latitude;
        const longtitude = position.coords.longitude;
        console.log(latitude);  //위도
        console.log(longitude);  //경도(동경135도)

        $.ajax({
            url : `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longtitude}&appid=7a69a1a267707ce60734f74ffc663e12`,
            dataType : "json",
            success : function(data){
                //console.log(data);
                const city = data.name;
                console.log("도시명 : " + city);
                const nation = data.sys.country;
                console.log("국가명 : " + nation);

                cityName.unshift(city);
                w_info();
            }
        });  //ajax 종료
    });
});