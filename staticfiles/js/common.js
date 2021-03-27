(function(){

    sessionStorage.setItem("keyword", "");
    sessionStorage.setItem("id", "");
    // sessionStorage.clear();

    // Make all checkbox uncheck
    let all_check_box = document.querySelectorAll("input:checked");
    for (let i = 0; i < all_check_box.length; i++) {
        all_check_box[i].checked = false;
    }

    // for default page
    const urlParams = new URLSearchParams(window.location.search);
    const str_query = urlParams.get("q");

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            document.getElementById("search").innerHTML = this.responseText;
        }
    };

    xhttp.open("GET", "/search/?q=" + str_query, true);
    xhttp.send();

})();





function timeRangeAjaxCall(k, item) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            document.getElementById("search").innerHTML = this.responseText;
        }
    };

    xhttp.open("GET", "/keyword/?" + k + "=" + item, true);
    xhttp.send();
}

function selectDateView() {
    let err = false;
    let start_date = document.getElementById("start_date").value;
    let end_date = document.getElementById("end_date").value;

    if (start_date == "") {
        err = true;
    }

    if (end_date == "") {
        err = true;
    }

    if (!err) {
        let d_obj = { start: start_date, end: end_date };
        sessionStorage.setItem("d_obj", JSON.stringify(d_obj));
        timeRangeAjaxCall("s", sessionStorage.getItem("d_obj"));
    }
}

function timeRangeDataView() {
    let y = (w = m = false);

    let y_id = document.getElementById("yesterday");
    let w_id = document.getElementById("week");
    let m_id = document.getElementById("month");

    if (y_id.checked == true) {
        y = true;
    } else if (y_id.checked == false) {
        y = false;
    }

    if (w_id.checked == true) {
        w = true;
    } else if (w_id.checked == false) {
        w = false;
    }

    if (m_id.checked == true) {
        m = true;
    } else if (m_id.checked == false) {
        m = false;
    }

    let ob = { y: y, w: w, m: m };
    sessionStorage.setItem("time_range_obj", JSON.stringify(ob));
    timeRangeAjaxCall("d", sessionStorage.getItem("time_range_obj"));
}

// Here use linear search algorithm
function linearSearch(arr, item) {
    let b = false;

    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == item) {
            b = true;
        }
    }

    if (b == false) {
        return true;
    } else {
        return false;
    }
}

function keywordAjaxCall(key1, item1, key2, item2) {
    if (!item1) {
        item1 = [];
    }

    if (!item2) {
        item2 = [];
    }

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            document.getElementById("search").innerHTML = this.responseText;
        }
    };

    xhttp.open("GET", "/keyword/?" + key1 + "=" + item1 + "&" + key2 + "=" + item2, true);
    xhttp.send();
}

function check(obj, type) {
    let input_value = obj.value;

    if (obj.checked == true && type == "u") {
        let id = [],
            get_id = [];

        if (sessionStorage.getItem("id")) {
            get_id = JSON.parse(sessionStorage.getItem("id"));

            if (linearSearch(get_id, input_value)) {
                get_id.push(input_value);
            }
            sessionStorage.setItem("id", JSON.stringify(get_id));
        } else {
            id.push(input_value);
            sessionStorage.setItem("id", JSON.stringify(id));
        }

        keywordAjaxCall("id", sessionStorage.getItem("id"), "keyword", sessionStorage.getItem("keyword"));

        // sessionStorage.removeItem("key");
        // sessionStorage.clear();

        // document.getElementById("search").innerHTML = sessionStorage.getItem("id");
        // console.log(sessionStorage);
    } else if (obj.checked == false && type == "u") {
        if (sessionStorage.getItem("id")) {
            let get_id = JSON.parse(sessionStorage.getItem("id"));

            get_id = get_id.filter(function (value, index, arr) {
                return value != input_value;
            });

            sessionStorage.setItem("id", JSON.stringify(get_id));
            keywordAjaxCall("id", sessionStorage.getItem("id"), "keyword", sessionStorage.getItem("keyword"));

            // console.log(input_value+" Delete");
            // console.log(sessionStorage);
            // document.getElementById("search").innerHTML = sessionStorage.getItem("id");
        }
    }

    if (obj.checked == true && type == "k") {
        let keyword = [],
            get_keyword = [];

        if (sessionStorage.getItem("keyword")) {
            get_keyword = JSON.parse(sessionStorage.getItem("keyword"));

            if (linearSearch(get_keyword, input_value)) {
                get_keyword.push(input_value);
            }

            sessionStorage.setItem("keyword", JSON.stringify(get_keyword));
        } else {
            keyword.push(input_value);
            sessionStorage.setItem("keyword", JSON.stringify(keyword));
        }

        keywordAjaxCall("id", sessionStorage.getItem("id"), "keyword", sessionStorage.getItem("keyword"));

        // sessionStorage.removeItem("key");
        // sessionStorage.clear();
        // document.getElementById("search").innerHTML = sessionStorage.getItem("keyword");
        // console.log(sessionStorage);
    } else if (obj.checked == false && type == "k") {
        if (sessionStorage.getItem("keyword")) {
            let get_keyword = JSON.parse(sessionStorage.getItem("keyword"));

            get_keyword = get_keyword.filter(function (value, index, arr) {
                return value != input_value;
            });

            sessionStorage.setItem("keyword", JSON.stringify(get_keyword));
            keywordAjaxCall("id", sessionStorage.getItem("id"), "keyword", sessionStorage.getItem("keyword"));

            // console.log(input_value+" Delete");
            // console.log(sessionStorage);
            // document.getElementById("search").innerHTML = sessionStorage.getItem("keyword");
        }
    }

    // document.getElementById("myCheck").checked = false;
    // document.getElementById("myCheck").checked = true;
}

