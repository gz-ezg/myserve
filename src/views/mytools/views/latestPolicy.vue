<template>
    <div class="page"> 
        <img @click.stop="selectOk" class="bg" src="@/assets/latestPolicy_bg.png"/>
        <div class="back" @click="back">返回</div>
        <div class="search">
          <div class="search__left" @click="handleSelectAddress">
            {{Area}}
            <div class="trangle"></div>
          </div>
          <div class="search__input"><input value="" id="input1" @focus="onFocus" @blur="onBlur" placeholder="搜索关键字"/></div>
          <div class="search__right" @click="handleSearch"><img src="@/assets/search__input.png" ></div>
        </div>
        <div class="picker" v-if="isSelect">
          <van-area :area-list="areaList" :value="areaValue" :columns-num="2"  :item-height="88" @change="areaChange" />
        </div>
        <van-list v-if="list.length" class="content" v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" >
          <van-cell v-for="(item,index) in list" :key="index" class="content-item" @click="showPopup(item)">
            <div slot="default">
              <div class="title">{{item.Title}}</div>
              <div class="disc">
                {{item.Province}}
                <span style="margin:0 10px">{{item.Label}}</span>
                {{item.Date}}
              </div>
            </div>
          </van-cell>
        </van-list>
        <van-popup v-model="show" position="bottom" closeable close-icon="close" :style="{ maxHeight: '80%',minHeight: '30%',overflow:'auto'}">
          <div class="popus">
            <div v-html="content"></div>
          </div>
        </van-popup>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import NavBar from '@/components/NavBar/index.vue';
import { formatDate} from '@/utils';
import { removeStorage,setStorage ,getStorage1} from '@/utils/storage';
import { Area, List,Cell,Popup} from 'vant';
@Component({
  components: {
    NavBar,
    [Area.name] : Area,
    [List.name] : List,
    [Cell.name] : Cell,
    [Popup.name] : Popup,
  }
})

export default class latestPolicy extends Vue{
  private areaValue:string="440100"
  private Area:string = "广州市"
  private title:string = ""
  private title1:string = ""
  private content:string = ""
  private isSelect:boolean = false
  private loading:boolean = false
  private finished:boolean = false
  private show:boolean = false
  private hasMore:boolean = true
  private page:number = 0
  private pageSize:number = 10
  private list:any = []
  private areaList:any = {
    province_list: {},
    city_list: {}
  }

    back(){
      this.$router.go(-1)
    }
    areaChange(picker:any,value:any,index:any){
      this.areaValue = value[1].code
      this.Area = value[1].name
    }
    handleSelectAddress(){
      this.isSelect = !this.isSelect;
			this.list = [];
    }
    selectOk() {
			this.isSelect = false;
			// this.list = [];
    }
    onFocus(){
      this.isSelect = false;
    }
    onBlur(){
      let x:any= document.getElementById('input1')
      this.title1 = x.value
      console.log(this.title1)
    }
    onLoad(){
      this.getList()
      // console.log("123")
    }
    showPopup(i:any){
      this.content= ""
      this.content = i.HContent
      this.show = true   
    }
    async handleSearch() {
			this.isSelect = false;
			this.page = 0;
			if (!this.title1) {
				return this.$toast('请输入关键字');
      }
      this.list = [];
      console.log("123")
			this.getList();
    }
    async getList() {
			this.loading = true;
			if (this.finished) {
				return false;
      }
			this.page = this.page + 1;
			try {
				const resp = await this.$storeApi.policyList({ city: this.Area, title: this.title1, page: this.page, pageSize: this.pageSize },true);
				if (!resp.result.length) {
					this.$toast('查询暂无结果');
          this.page = 0;
          this.finished = false
				} else{
          this.finished = resp.total > this.page * this.pageSize ? false : true;
        }
				this.list = [
					...this.list,
					...resp.result.map((v:any) => {
						v.Date = v.Date.substring(0,10);
						return v;
					})
        ];
        console.log(this.list)
			} catch (e) {
				//TODO handle the exception
			} finally {
				this.loading = false;
			}
		}
    async getProvince() {
			try {
        let province = await this.$storeApi.getProvinceList();
        let obj :any= {}
        let obj1 :any= {}
        let arr:any= []
        // console.log(province)
        province.map((v:any)=>{
            let num = v.province.id
            obj[num] = v.province.areaname
            arr = arr.concat(v.city)
        })
        arr.map((v:any)=>{
            let num = v.id
            obj1[num] = v.realname
        })
        this.areaList.province_list = obj
        this.areaList.city_list = obj1
        setStorage('areaList',this.areaList);
			} catch (e) {
        this.$toast('获取省市数据失败');
				//TODO handle the exception
			} finally {
				// this.loading = false;
      }
    }
    async created() {
      let a = getStorage1("areaList")
      if(a){
          this.areaList = a
      } else{
          await this.getProvince();  
      }
      // console.log(getStorage1("areaList"))
  }
}
</script>

<style lang="scss">
@import '@/styles/mixin.scss';

.van-picker__toolbar {
    display: none
}

.page {
    width: 100%;
    height: 100vh;
    min-height: 667px;
    overflow: hidden;
    .bg{
        width: 100%;
        height: 100%;
        min-height: 667px;
    }
    .back {
        position: absolute;
        width: 62.5px;
        height: 25px;
        text-align: center;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 1px 0px 0px rgba(226, 22, 22, 1);
        border-radius: 4px;
        font-size: 10px;
        font-weight: 500;
        right: 16.5px;
        top: 118px;
        color: rgba(226, 22, 22, 1);
        line-height: 25px;
    }
    .popus {
      padding: 0 16px 16px;
      font-size: 10px;
      color: #7d8386;
      word-break:break-all;
      word-wrap: break-word;
      word-break: normal;
      // overflow: hidden;
      // max-height: 1000upx;
      // width: 683upx;   
      .title{
        color: #000;
        font-size: 20px;
        text-align: center
      }
      .content{
        word-break:break-all;
        word-wrap: break-word;
        word-break: normal;
      }
	  }
    .picker {
        @include absolute-center-top(226px);
        width: 342px;
        height: 250px;
        font-size: 12px;
        color: #000;
        background: #ffffff;
        border-radius: 4px;
        overflow: hidden;

        .item {
          line-height: 50px;
          text-align: center;
          // width: 100upx;
        }
      }
    .content {
          @include absolute-center-top(230px);
          width: 342px;
          height: 300px;
          background: #ffffff;
          box-shadow: 0px -1px 0px 0px rgba(93, 72, 67, 0.16);
          border-radius: 6px;
          overflow: auto;

          &-item {
            padding: 0 14px;
            position: relative;
            padding-top: 1rpx;
            height: 75px;
            border-bottom: 1px solid rgba(93, 72, 67, 0.16);

            .title {
              margin: 8px 0;
              font-size: 12px;
              font-weight: 500;
              color: rgba(44, 34, 34, 1);
              line-height: 20px;
              padding-right: 5px;
              overflow: hidden;
              // width: 683upx;
              @include ellipse-text(1);
            }

            .disc {
              font-size: 10px;
              font-weight: 400;
              color: rgba(125, 131, 134, 1);
              @include ellipse-text(1);
              overflow: hidden;

              &_item {
                margin: 5px 0;
              }
			}

              .button {
                position: absolute;
                right: 28upx;
                top: 90upx;
                width: 133upx;
                height: 50upx;
                font-size: 19upx;
                text-align: center;
                line-height: 50upx;
                font-weight: 400;
                color: rgba(255, 255, 255, 1);
                background: linear-gradient(90deg, rgba(242, 63, 15, 1) 0%, rgba(246, 30, 21, 1) 100%);
                box-shadow: 0upx -1upx 0upx 0upx rgba(93, 72, 67, 0.16);
              }

              .button_gray {
                background: linear-gradient(90deg, rgba(217, 221, 224, 1) 0%, rgba(198, 204, 207, 1) 100%);
              }
		}
	}
    .search{
      @include absolute-center-top(184px);
      display: flex;
      border-radius: 4px;
      width: 341.5px;
      height: 39px;
      background: white;
      &__left{
        position: relative;
        display: flex;

        align-items: center;
        justify-content: center;
        padding-right: 4px;
        width: 66px;
        height: 39px;
        font-size: 11px;
        box-shadow: -1px 0px 0px 0px rgba(93, 72, 67, 0.16);

        .trangle {
          position: absolute;
          right: 6px;
          top: 19px;
          width: 0;
          height: 0;
          border-width: 3px;
          border-style: solid;
          border-color: #000 transparent transparent transparent;
			  }
        img {
          height: 15px;
          width: 15px;
        }
      }
      
      &__input {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        flex: 1;
        height: 100%;
        line-height: 39px;

        input {
          width: 90%;
          height: 22px;
          border: none
        }

        ::-webkit-input-placeholder{
          font-size: 11px;
          box-shadow: 0px 0px 0px 0px rgba(93, 72, 67, 0.16);
          color: #ced0d6;
        }
      
    }
    
      &__right {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 52px;
        height: 39px;
        background: linear-gradient(90deg, rgba(242, 63, 15, 1) 0%, rgba(246, 30, 21, 1) 100%);
        border-radius: 0px 4px 4px 0px;

        img {
          height: 20px;
          width: 20px;
        }
      }
    }
}
</style>