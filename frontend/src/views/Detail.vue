<template>
  <div>
    <div class="w-50 ml-auto mr-auto mt-5 shadow p-3">
      <div class="h1 text-center ">{{ post.title }}</div>
      <div>
        <!-- textarea -->
        <div class="mt-2 text-right">{{ date }}</div>
        <div v-if="post.file"
          class="download mt-3 text-right text-primary"
          @click="download(post.file)"
        >
          {{ file }}
        </div>
        <b-form-textarea
          disabled
          class="bg-white mt-3"
          id="textarea-rows"
          v-model="post.content"
          placeholder="Enter something..."
          rows="8"
        ></b-form-textarea>

        <div>
          <div v-if="datacollection" class="small">
            <line-chart :chart-data="datacollection"></line-chart>
            <!-- <button @click="fillData()">Randomize</button> -->
          </div>
        </div>
      </div>
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
      post: [],
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
    this.post = data.post;

    const newArr = data.log.split("&&&&").reduce((acc, cur) => {
      if (cur) {
        // console.log(acc);
        // console.log(cur);
        acc.push(cur.trim().split("__"));
      }
      return acc;
    }, []);

    // console.log(newArr);
    this.arr = newArr;

    const datasets = [
      {
        label: "에러 발생 시각",
        backgroundColor: "#f87979",
        data: newArr.map((li) => new Date(li[0]).getHours()),
      },
    ];

    // console.log(datasets);
    this.chartData = datasets;
    this.fillData();
  },
  computed: {
    file() {
    
        return `${this.post.file.split("&&")[0]}.${
          this.post.file.split("&&")[1].split(".")[1]
        }`;
      
    },
    date() {
      const day = new Date(this.post.updatedAt);
      // console.log(day.format('yyyy-MM-dd'));
      return `${day.getFullYear()}년 ${day.getMonth()}월 ${day.getDay()}일`;
    },
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
  },
};
</script>

<style>
.small {
  max-width: 600px;
  margin: 150px auto;
}
.download {
  cursor: pointer;
}
.download:hover {
  opacity: 0.5;
}
</style>
