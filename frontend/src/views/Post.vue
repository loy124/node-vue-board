<template>
  <div>
    <b-form class="w-50 ml-auto mr-auto mt-5" @submit="post">
      <b-form-group id="input-group-1" label="제목" label-for="input-1">
        <b-form-input
          id="input-1"
          v-model="form.title"
          type="text"
          required
          placeholder="제목을 입력해 주세요."
        ></b-form-input>
      </b-form-group>
      <b-form-file
        v-model="form.file"
        :state="Boolean(form.file)"
        placeholder="Choose a file or drop it here..."
        drop-placeholder="Drop file here..."
      ></b-form-file>
      <div class="mt-3">
        Selected file: {{ form.file ? form.file.name : "" }}
      </div>

      <b-form-textarea
        class="mt-4"
        id="textarea"
        v-model="form.content"
        placeholder="Enter something..."
        rows="15"
        max-rows="10"
      ></b-form-textarea>

      <div class="d-flex justify-content-end mt-3">
        <b-button type="submit" variant="primary">글쓰기</b-button>
        <!-- <b-button type="reset" variant="danger">Reset</b-button> -->
      </div>
    </b-form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      form: {
        title: "",
        content: "",
        file: null,
        file2: null,
      },
    };
  },
  methods: {
    async post(evt) {
      try {
        evt.preventDefault();
      const { title, content, file } = this.form;

      // console.log(this.form.file);
      // userId 
      const formData = new FormData();
      formData.append("userId", sessionStorage.getItem("id"));
      formData.append("title", title);
      formData.append("content", content);
      formData.append("file", file);
      console.log(file);

      const {status} = await axios.post("http://localhost:8000/api/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(status);
      if(status === 200){
        alert("게시글 작성이 완료되었습니다");
        this.$router.push("/");
      }

      } catch (error) {
        alert("오류가 발생하였습니다.");
        this.$router.push("/");
      }
    },
  },
};
</script>
