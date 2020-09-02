<template>
  <div>
    <!-- <b-table hover :items="items"></b-table> -->

    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th class="text-center" scope="col">제목</th>
          <th  scope="col">파일</th>
          <th scope="col">날짜</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(li, index) in list" :key="index">
          <th scope="row">{{ index + 1 }}</th>
          <td style="width:60%;" class="text-center" @click="detail(li.id)">
            {{li.title}}
            <!-- <b-form-input
              disabled
              v-model="li.content"
              placeholder="Enter your name"
            ></b-form-input> -->
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
      const res = await axios({
        method: "GET",
        url: "http://localhost:8000/api/download",
        responseType: "blob",
        params: {
          fileName: file,
        },
      });

      console.log(res.headers["content-type"]);
      console.log(res);
      // const bytes = new Uint8Array(res.data);
      let blob = new Blob([res.data], { type: res.headers["content-type"] });
    
      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: res.headers["content-type"] })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file);
      document.body.appendChild(link);
      link.click();
    },

    file(data) {
      console.log(data);
      const fileName = `${data.split("&&")[0]}.${
        data.split("&&")[1].split(".")[1]
      }`;
      return fileName;
    },
    detail(id){
      console.log(id);
      this.$router.push(`/detail/${id}`)
      // 라우터로 이동
      // 디테일 화면 뿌리기
      // 파일에 대한 로그 분석하기
    }
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
tr:hover{
  opacity: 0.5;
  cursor: pointer;
}
</style>
