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

      <div class="mt-5">
        <b-button class="w-100" type="submit" variant="primary">로그인</b-button>
        <b-button class="w-100 mt-3" type="button" variant="success">회원가입</b-button>
      </div>
    </b-form>
  </div>
</template>

<script>
export default {
 data() {
    return {
      form: {
        email: "",
        password: "",
       
      },
    };
  },
}
</script>

<style>

</style>