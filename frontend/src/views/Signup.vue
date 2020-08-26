<template>
  <div>
    <b-form @submit.prevent="SignUp" class="w-50 ml-auto mr-auto mt-5">
      <b-form-group
        id="input-group-1"
        label="아이디(이메일)"
        label-for="input-1"
        description="We'll never share your email with anyone else."
      >
        <b-form-input
          id="input-1"
          v-model="form.email"
          type="email"
          required
          placeholder="이메일을 입력하세요"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="비밀번호" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="form.password"
          type="password"
          required
          placeholder="비밀번호를 입력하세요 "
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Your Name:" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="form.name"
          required
          placeholder="Enter name"
        ></b-form-input>
      </b-form-group>

      <div class="mt-5 d-flex justify-content-center">
        <b-button type="submit" variant="primary">회원가입</b-button>
        <b-button type="reset" variant="danger" class="ml-3">초기화</b-button>
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
        email: "",
        password: "",
        name: "",
      },
    };
  },

  methods: {
    async SignUp() {
      const { email, password, name } = this.form;
      if (email && password && name) {
        try {
          const {data} = await axios.post(
            "http://localhost:8000/api/user",
            {
              email,
              password,
              name,
            },
            { withCredentials: true }
          );
          console.log(data);
          //   이때 cors 에러가 발생할것이다. 해결
          if (data.signup) {
            alert("회원가입이 완료되었습니다");
            this.$router.push("/login");
          }
        } catch (err) {
            console.log(err);
        }
      } else {
        alert("아이디 및 비밀번호, 이름을 입력해주세요");
      }
    },
  },
};
</script>

<style></style>
