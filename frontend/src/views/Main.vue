<template>
  <div>
    <!-- <b-table hover :items="items"></b-table> -->

    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">제목</th>
          <th scope="col">파일</th>
          <th scope="col">날짜</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(li, index) in list" :key="index">
          <th scope="row">{{ index + 1 }}</th>
          <td style="width:60%;">
            <b-form-input
              disabled
              v-model="li.content"
              placeholder="Enter your name"
            ></b-form-input>
          </td>
          <td>
            <div class="for-hover text-primary" @click="download(li.file)">
              {{ file(li.file) }}
            </div>
          </td>
          <td>
            <b-form-input
              disabled
              v-model="li.updatedAt"
              placeholder="Enter your name"
            ></b-form-input>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      list: [],
      items: [
        { age: 40, first_name: "Dickerson", last_name: "Macdonald" },
        { age: 21, first_name: "Larsen", last_name: "Shaw" },
        {
          age: 89,
          first_name: "Geneva",
          last_name: "Wilson",
          _rowVariant: "danger",
        },
        {
          age: 40,
          first_name: "Thor",
          last_name: "MacDonald",
          _cellVariants: { age: "info", first_name: "warning" },
        },
        { age: 29, first_name: "Dick", last_name: "Dunlap" },
      ],
    };
  },
  computed: {},
  methods: {
    async getPostList() {
      const { data } = await axios.get("http://localhost:8000/api/post");
      console.log(data);
      console.log(data.postList);
      this.list = data.postList;
    },
    async download(file) {
      console.log(file);
      // const formData = new FormData();
      // formData.append("fileName", file)
      const res = await axios.get(
        "http://localhost:8000/api/download",
        {
          params: {
            fileName: file,
          },
        },
        {
          headers: { responseType: 'arraybuffer', },
        }
      );

      // const blob = new Blob([response.data], {
      //   type: response.headers["content-type"],
      // });
      // const url = window.URL.createObjectURL(
      //   blob
      // );
      // console.log(res.data.file);
      // const url = window.URL.createObjectURL(new Blob([res.data.file]));
      // const contentDisposition = res.headers["content-disposition"]; // 파일 이름
      const anchor = document.createElement('a');
      console.log(file);
      // anchor.href = url;
      anchor.href = `../../../backend/uploads/${file}`
      anchor.setAttribute('download', file);
      document.body.appendChild(anchor);
      anchor.click();
      // let fileName = "unknown";
      // console.log(res);
      // if (contentDisposition) {
      //   const [fileNameMatch] = contentDisposition
      //     .split(";")
      //     .filter((str) => str.includes("filename"));
      //   if (fileNameMatch) [, fileName] = fileNameMatch.split("=");
      // }
      // link.href = url;
      // link.setAttribute("download", `${fileName}`);
      // link.style.cssText = "display:none";
      // document.body.appendChild(link);
      // link.click();
      // link.remove();
    },

    file(data) {
      console.log(data);
      const fileName = `${data.split("&&")[0]}.${
        data.split("&&")[1].split(".")[1]
      }`;
      return fileName;
    },
  },
  created() {
    this.getPostList();
  },
};
</script>

<style>
.for-hover:hover {
  cursor: pointer;
  opacity: 0.5;
}
</style>
