<template>
  <div class="get-wrapper" id="users" >
    <h1>Working with GET request</h1>
    <div class="users-wrapper">
      <b-container class="m-auto p-0 max1170">
        <b-row cols="1" cols-md="2" cols-xl="3" class="m-0">
          <b-col
              class="user"
              v-for="user in USERS"
              :key="user.id"
          >
            <b-row cols="1">
              <b-col class="avatar">
                <img :src="user.photo" alt="avatar" height="70px" width="70px" @error="replaceByDefault" style="border-radius: 50px">
              </b-col>
              <b-col class="name overflow"><span class="textapi">{{ user.name }}</span></b-col>
              <b-col class="info">
                <b-row cols="1">
                  <b-col class="overflow"><span class="textapi">{{ user.position }}</span></b-col>
                  <b-col class="overflow"><span class="textapi">{{ user.email }}</span></b-col>
                  <b-col><span class="textapi">{{ user.phone }}</span></b-col>
                </b-row>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-container>
    </div>
    <div
        v-if="NEXT_LINK"
        class="mybutton"
        style="margin: 0 auto; width: 120px"
        @click="GET_MORE_USERS"
    >
      Show more
    </div>
  </div>
</template>

<script>
import img from '@/assets/svg/photo-cover.svg'
import {mapActions, mapGetters} from 'vuex'
export default {
  name: "GetRequest",
  data() {
    return{
    }
  },
  computed: {
    ...mapGetters([
      'USERS',
      'NEXT_LINK'
    ])
  },
  methods: {
    ...mapActions([
      'GET_USERS_FROM_API',
      'GET_MORE_USERS'
    ]),

    replaceByDefault(e) {
      e.target.src = img
    },


  },
  mounted(){
    this.GET_USERS_FROM_API();
  }
}
</script>

<style lang="scss">
  .get-wrapper {
    margin: 140px 0 0 0;
    padding: 0 16px;
    .users-wrapper {
      margin: 50px auto 30px;
    }
  }

  .user {
    padding: 20px;
    line-height: 26px;
    border-radius: 10px;
    background-color: #fff;
  }

  .info, .name{
    margin-top: 20px;
  }

  .overflow {
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    white-space: nowrap;
    display: inline-block!important;
  }


</style>