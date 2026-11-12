import { Supabase as sb } from "./supabase.js";
import { upload } from "./upload-anh.js";
import { items } from "./store.js";

const PRODUCTS = await items("products");
const $ = (s) => document.querySelector(s);
const esc = (v) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const TABLES = {
  lien_he: {
    label: "Liên hệ",
    cols_labels: [
      "Họ tên",
      "Số điện thoại",
      "Loại sản phẩm",
      "Số lượng",
      "Nội dung",
    ],
    cols: ["name", "phone_number", "product_type", "quantity", "information"],
    fields: [
      ["name", "Họ tên"],
      ["phone_number", "Số điện thoại", "tel"],
      ["product_type", "Loại sản phẩm", "products"],
      ["quantity", "Số lượng", "number"],
      ["information", "Nội dung", "textarea"],
    ],
  },
  san_pham: {
    label: "Sản phẩm",
    cols_labels: ["Tên", "Mã", "Thứ tự", "Hiển thị"],
    cols: ["ten", "slug", "thu_tu", "hien"],
    fields: [
      ["ten", "Tên"],
      ["slug", "Mã (không dấu, vd: tem-nhan)"],
      ["anh", "Ảnh", "image"],
      ["thu_tu", "Thứ tự", "number"],
      ["hien", "Hiển thị", "checkbox"],
    ],
  },
  kien_thuc: {
    label: "Kiến thức",
    cols_labels: ["Tiêu đề", "Mô tả", "Hiển thị"],
    cols: ["ten", "mo_ta", "hien"],
    fields: [
      ["ten", "Tiêu đề"],
      ["slug", "Mã bài (không dấu, vd: ep-kim-la-gi)"],
      ["anh", "Ảnh", "image"],
      ["mo_ta", "Mô tả", "textarea"],
      ["thu_tu", "Thứ tự", "number"],
      ["hien", "Hiển thị", "checkbox"],
    ],
  },
};
let tab = "lien_he",
  editing = null;

const form = () => {
  $("#f").innerHTML =
    TABLES[tab].fields
      .map(([k, l, type = "text"]) =>
        type === "textarea"
          ? `<label>${l}<textarea name="${k}" rows="4"></textarea></label>`
          : type === "checkbox"
            ? `<label><input type="checkbox" name="${k}" checked>${l}</label>`
            : type === "image"
              ? `<label>${l}<input type="file" id="file" accept="image/*"><input type="hidden" name="${k}"><img id="pv" alt="" hidden></label>`
              : type === "tel"
                ? `<label>${l}<input type="tel" name="${k}" inputmode="tel" required pattern="[0-9 +.]{9,16}" autocomplete="tel"></label>`
                : type === "products"
                  ? `<label>${l}<select name="${k}">'<option value="">Chọn loại ấn phẩm…</option>'${[...PRODUCTS.map((p) => p.name), "Khác"].map((n) => `<option>${n}</option>`).join("")}</select></label>`
                  : `<label>${l}<input name="${k}" type="${type}"${type === "number" ? ' value="0"' : ""}></label>`,
      )
      .join("") +
    '<button class="btn">Lưu</button> <button type="button" class="btn alt" id="cancel">Hủy</button>';
  $("#cancel").onclick = () => {
    if (confirm("Hủy thay đổi?")) {
      editing = null;
      form();
    }
  };
  if ($("#file"))
    $("#file").onchange = (e) => {
      const f = e.target.files[0];
      if (f) {
        $("#pv").src = URL.createObjectURL(f);
        $("#pv").hidden = false;
      }
    };
};

const render = async () => {
  const t = TABLES[tab];
  document
    .querySelectorAll("#tabs button")
    .forEach((b) => b.classList.toggle("on", b.dataset.t === tab));
  const { data = [], error } = await sb
    .from(tab)
    .select("*")
    .order("created_at", { ascending: false });
  $("#list").innerHTML = error
    ? `<p id="msg" class="err">${esc(error.message)}</p>`
    : `<table class="tbl"><tr>${t.cols_labels.map((l) => `<th>${l}</th>`).join("")}<th></th></tr>${data
      .map(
        (r) =>
          `<tr>${t.cols.map((c) => `<td>${esc(r[c])}</td>`).join("")}<td>${tab !== "lien_he" ? `<a href="soan.html?t=${tab}&id=${r.id}">Nội dung</a> ` : ""}<button data-e="${r.id}">Sửa</button> <button data-d="${r.id}">Xóa</button></td></tr>`,
      )
      .join("")}</table>`;
};

$("#tabs").innerHTML = Object.entries(TABLES)
  .map(([k, t]) => `<button data-t="${k}">${t.label}</button>`)
  .join("");
$("#tabs").onclick = (e) => {
  if (e.target.dataset.t) {
    tab = e.target.dataset.t;
    editing = null;
    form();
    render();
  }
};

const rm = (url) => {
  const p = url?.split("/object/public/anh/")[1];
  if (p) sb.storage.from("anh").remove([p]);
};
$("#list").onclick = async (e) => {
  const { e: eid, d: did } = e.target.dataset;
  if (did && confirm("Xóa mục này?")) {
    const { data: old } = await sb
      .from(tab)
      .select("anh")
      .eq("id", did)
      .single();
    await sb.from(tab).delete().eq("id", did);
    rm(old?.anh);
  }
  if (eid) {
    const { data: row } = await sb.from(tab).select("*").eq("id", eid).single();
    editing = eid;
    TABLES[tab].fields.forEach(([k, , type]) => {
      const el = $("#f").elements[k];
      type === "checkbox" ? (el.checked = row[k]) : (el.value = row[k] ?? "");
      if (type === "image") {
        $("#file").value = "";
        $("#pv").src = row[k];
        $("#pv").hidden = false;
      }
    });
    scrollTo({ top: 0, behavior: "smooth" });
  }
};

$("#f").onsubmit = async (e) => {
  e.preventDefault();
  const row = {};
  TABLES[tab].fields.forEach(([k, , type]) => {
    const el = e.target.elements[k];
    row[k] =
      type === "checkbox"
        ? el.checked
        : type === "number"
          ? Number(el.value)
          : el.value;
  });
  const file = $("#file")?.files[0];
  if (file) {
    try {
      row.anh = await upload(file, tab);
    } catch (err) {
      return alert("Tải ảnh lỗi: " + err.message);
    }
  }
  if ("anh" in row && !row.anh) return alert("Vui lòng chọn ảnh.");
  const { data, error } = await (editing
    ? sb.from(tab).update(row).eq("id", editing)
    : sb.from(tab).insert(row).select("id").single());
  if (error) return alert(error.message);
  if (!editing && tab !== "lien_he")
    return (location.href = `soan.html?t=${tab}&id=${data.id}`);
  editing = null;
  alert("Dữ liệu đã được cập nhật");
  form();
  render();
};

// Chỉ để ẩn/hiện giao diện; bảo mật thật nằm ở RLS.
await sb.auth.refreshSession();
const {
  data: { user },
} = await sb.auth.getUser();
if (user?.app_metadata?.app_role === "admin") {
  form();
  render();
} else
  document.querySelector("main").innerHTML =
    '<div class="wrap sec"><p>Bạn không có quyền truy cập trang này.</p></div>';
