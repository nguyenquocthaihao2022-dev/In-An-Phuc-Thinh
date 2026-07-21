import { Supabase } from "./supabase.js";

const { data, error } = await Supabase
    .from("dich_vu")
    .select("*");
const container = document.querySelector(".dich_vu");

if (container) {
    data.forEach((dich_vu) => {
        const item_div = document.createElement("div");
        item_div.classList.add("item_div");

        const item = document.createElement("a");
        item.classList.add("item");
        item.href = dich_vu.link;

        const img = document.createElement("img");
        img.src = dich_vu.img_link;

        const p = document.createElement("p");
        p.textContent = dich_vu.name;

        item.appendChild(img);
        item.appendChild(p);
        item_div.appendChild(item);
        container.appendChild(item_div);
    });
}