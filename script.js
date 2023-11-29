
// load data
const loadData = async () => {
    try {
        const server_response = await fetch("https://openapi.programming-hero.com/api/videos/categories")
        const data = await server_response.json();
        //console.log(data);
        createButton(data.data);
    }
    catch {
        (error) => {
            console.log(error);
        };
    }
};

// option buttons

const optionButton = document.getElementById("options");
const createButton = (data) => {
    data.forEach((media) => {
        const card = document.createElement("div");
        card.classList.add("option_bar");
        card.innerHTML = `
        <button class="optn-btn" id="${media.category_id}" onclick="DisplayItems('${media.category_id}')">${media.category}</button>`;

        optionButton.appendChild(card);
    });
};

// show items

let selected_category_id; // global category id to use later in sort by view
const DisplayItems = async (id) => {
    selected_category_id = id; // saving it for sort button
    try {
        const response = await fetch(`https://openapi.programming-hero.com/api/videos/category/${id}`);
        const data = await response.json();
        //console.log(data);

        if (data.status) {
            items_card(data.data, data.status);
        }
        else {
            no_content(data);
        }
    }
    catch {
        (error) => {
            console.log(error);
        }
    }
};
// sort buttons work

//object sorting function
const sort_by_views = (data) => {
    if (data && data.data && Array.isArray(data.data)) {
        data.data.sort((a, b) => {
            let view_a = 0;
            let view_b = 0;

            if (a.others && a.others.views) {
                view_a = Views(a.others.views);
            }
            if (b.others && b.others.views) {
                view_b = Views(b.others.views);
            }

            return view_b - view_a;
        });

        return data.data;
    }
};

const viewSort = document.getElementById("view_sort");
viewSort.addEventListener("click", async () => {
    try {
        const response = await fetch(`https://openapi.programming-hero.com/api/videos/category/${selected_category_id}`);
        const data = await response.json();
        //console.log(data);

        if (data.status) {
            var sortData = sort_by_views(data);
            items_card(sortData, data.status);
        }
        else {
            no_content(data);
        }
    }
    catch (error) {
        console.log(error);
    }
});

// views conversion into number
const Views = (views_in_String) => {
    let letter_to_num = 1;
    if (views_in_String[views_in_String.length - 1] === "M") {
        letter_to_num = 1000000;
    }
    else if (views_in_String[views_in_String.length - 1] === "K") {
        letter_to_num = 1000;
    }
    return parseFloat(views_in_String) * letter_to_num;
};

// time conversion

function time_convertor(seconds) {
    if (isNaN(seconds) || seconds == 0) {
        return "";
    }

    let minutes = Math.floor((seconds % 3600) / 60);
    let hours = Math.floor(seconds / 3600);

    const time = `${hours} hours ${minutes} minutes`;

    return time;
};

// content section

const content = document.getElementById("item_view");

// handle no content
const no_content = (data) => {
    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }

    const media_Section = document.createElement('div');
    media_Section.classList.add('media_section');
    media_Section.innerHTML = `
    <div class="no_content">
        <img src = "./Icon.png" alt ="picture"/>
        <h3>Opps ! Sorry , No content here</h3>
    </div>`;
    content.appendChild(media_Section);
};

// creating card for each media item

const items_card = (data, dataStatus) => {
    if (dataStatus) {
        while (content.firstChild) {
            content.removeChild(content.firstChild);
        }
        data.forEach((data_info) => {

            const media_Section = document.createElement("div");
            media_Section.classList.add("media_container");
            media_Section.innerHTML = `
            <div class=" content_thumbnail position-relative">
                <img src="${data_info.thumbnail}" alt="picture" />
                <p id="time_display">${time_convertor(data_info.others.posted_date)!="" ? `Updated : ${time_convertor(data_info.others.posted_date)}`:``}</p>
            </div>
            <div class="content_details">
                <div class="profile_picture mt-2">
                    <img src="${data_info.authors[0].profile_picture}" alt="" />
                </div>
                <div class="author_info mt-2">
                    <h3>${data_info.title}</h3>
                    <p>${data_info.authors[0].profile_name}</p>
                    <img src="${data_info.authors[0].verified ? './verified_pf.png' : './non_verified.png'}" alt="icon" class="verified-icon">
                    <p>${data_info.others.views} views</p>
                </div>
            </div>`;

            content.appendChild(media_Section);
        });
    }
    else {
        no_content(data);
    }
};

loadData();
DisplayItems(1000); // default all items shown