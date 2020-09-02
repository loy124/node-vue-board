<template>
  <div>
    <div v-if="datacollection" class="small">
      <line-chart :chart-data="datacollection"></line-chart>
      <!-- <button @click="fillData()">Randomize</button> -->
    </div>
  </div>
</template>

<script>
import axios from "axios";
import LineChart from "../utils/LineChart";
export default {
  components: {
    LineChart,
  },
  data() {
    return {
      datacollection: null,
      chartData: [],
      arr: [],
    };
  },
  async mounted() {
    console.log(this.$route);
    const { id } = this.$route.params;

    console.log(id);
    const { data } = await axios.get(`http://localhost:8000/api/post/${id}`);
    console.log(data);
    console.log(data.log.split("&&&&"));
    const newArr = data.log.split("&&&&").reduce((acc, cur) => {
      if (cur) {
        console.log(acc);
        console.log(cur);
        acc.push(cur.trim().split("__"));
      }
      return acc;
    }, []);

    console.log(newArr);
    this.arr = newArr;
    // let arr = data.log.split("&&&&");
    // arr = arr.map((li) => li.trim());
    // console.log(arr);
    // arr = arr.map((li) => li.split("__"));
    // console.log(arr);
    // 이곳에서 해줘야 하는 것
    // chart.js 연동해서
    // 타이틀의 정보와 파일의 경로 정보등이 나와있다
    // id를 통해 요청 보내기
    // 디테일 정보를 뿌려주는 backend 구축하기
    // axios.get("")
    // 파일의 정보 담아서 보내오기
    // 로그의 데이터 값을 읽어와서 차트로 출력하기
    // chart.js
    // console.log(this.chartData[0][0]);
    // const day = new Date(this.chartData[0][0]);
    // console.log(day);
    // const datasets = newArr.reduce((acc, cur, index, array) => {
    //   if (cur) {
    //     acc.push({
    //       label: `Data ${index}`,
    //       backgroundColor: "#f87979",
    //       data: [ new Date(cur[0]).getDay(), new Date(cur[0]).getHours(),],
    //     });
    //   }
    //   return acc;
    // }, []);
    const datasets = [
      {
        label: "에러 발생 시각",
        backgroundColor: "#f87979",
        data: newArr.map((li) => new Date(li[0]).getHours()),
      },
    ];

    console.log(datasets);
    this.chartData = datasets;
    this.fillData();
  },
  methods: {
    fillData() {
      this.datacollection = {
        labels: this.arr.map((li) => new Date(li[0]).getDate() + "일"),
        datasets: this.chartData,
        // datasets: [

        //   {
        //     label: "Data One",
        //     backgroundColor: "#f87979",
        //     data: [new Date(this.chartData[0][0]), this.chartData[0][1], ],
        //   },
        //    {
        //     label: "Data One",
        //     backgroundColor: "#f87979",
        //     data: [this.chartData[1][1], new Date(this.chartData[1][0])],
        //   },
        // //    {
        // //     label: "Data One",
        // //     backgroundColor: "#f87979",
        // //     data: [this.chartData[0][1], new Date(this.chartData[1][0])],
        // //   },
        //   //   {
        //   //     label: "Data One",
        //   //     backgroundColor: "#f87979",
        //   //     data: [this.getRandomInt(), this.getRandomInt()],
        //   //   },
        // ],
      };
    },
    getRandomInt() {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
    },
    destoryed() {},
  },
};
</script>

<style>
.small {
  max-width: 600px;
  margin: 150px auto;
}
</style>
