<script>
import { ref, onMounted, watch } from "vue";
import { mapActions } from "vuex";
import { useStore } from "vuex";

export default {
  setup() {
    let active = ref(0);
    const first = ref(0);
    
    let tats = ref({});
    const isLoading = ref(true);
    const isLoaded = ref(false);
    let currentGenre = ref();
    let showFilters=ref(true)
    const selectedFilter = ref("All");
    const filters = ref([
      { name: "All", code: "ALL" },
      { name: "Color", code: "CLR" },
      { name: "Black & Gray", code: "BG" },
      { name: "Melanated Skin", code: "MS" },
      { name: "Manga Panels", code: "MP" },
      { name: "Cute & Sparkly", code: "CS" },
      { name: "Realism", code: "RLS" },
      { name: "Traditional", code: "TRD" },
      { name: "Embroidery", code: "EMB" },
    ]);
    const genres = [
      { id: 0, slug: "all",},
      { id: 1, slug: "color"},
      { id: 2, slug: "black-and-gray"},
      { id: 3, slug: "melanated" },
      { id: 4, slug: "manga" },
      { id: 5, slug: "cute" },
      { id: 6, slug: "realism" },
      { id: 7, slug: "traditional" },
      { id: 8, slug: "patches" },
    ];
    const items = ref([
      { label: "All" },
      { label: "Full Color" },
      { label: "Black & Gray" },
      { label: "Melanated Skin" },
      { label: "Manga Panels" },
      { label: "Cute & Sparkly" },
      { label: "Realism" },
      { label: "Traditional" },
      { label: "Embroidery" },
    ]);
    function newPage(val) {
      let params = {
        page: val.page,
        size: 9,
        slug: currentGenre.value,
      };
      store.dispatch("fetchMedia", params).then((r) => {
        tats.value = r;
        setTimeout(function () {
          //do what you need here
          isLoading.value = false;
          isLoaded.value = true;
        }, 3000);
      });
    }
    const store = useStore();
    onMounted(() => {
      let params = {
        page: 0,
        size: 9,
        slug: "",
      };
      currentGenre.value = "all";
      store.dispatch("fetchMedia", params).then((r) => {
        tats.value = r;
        setTimeout(function () {
          //do what you need here
          isLoading.value = false;
          isLoaded.value = true;
        }, 3000);
      });
    });
    watch(selectedFilter, async (val, oldVal) => {
      showFilters.value=false;
      isLoading.value=true
      isLoaded.value=false
      if (genres) {
        var index = filters.value.map(function(o) { return o.name; }).indexOf(val);
        active.value = index
        Object.keys(genres).forEach((e) => {
          if (e == index) {
            currentGenre.value = genres[e].slug;
            let params = {
              page: 0,
              size: 9,
              slug: genres[e].slug,
            };
            store.dispatch("fetchMedia", params).then((r) => {
              tats.value = r;
              setTimeout(function () {
                //do what you need here
                isLoading.value = false;
                isLoaded.value = true;
              }, 3000);
            });
          }
        });
      }
    });
    watch(active, async (val, oldVal) => {
      isLoading.value = true;
      if (genres) {
        Object.keys(genres).forEach((e) => {
          if (e == val) {
            currentGenre.value = genres[e].slug;
            let params = {
              page: 0,
              size: 9,
              slug: genres[e].slug,
            };
            store.dispatch("fetchMedia", params).then((r) => {
              tats.value = r;
              setTimeout(function () {
                //do what you need here
                isLoading.value = false;
                isLoaded.value = true;
              }, 3000);
            });
          }
        });
      }
      isLoaded.value = false;
      first.value = 0;
    });
    return {
      isLoading,
      isLoaded,
      items,
      active,
      tats,
      genres,
      newPage,
      currentGenre,
      first,
      selectedFilter,
      filters,
      showFilters
    };
  },
};
</script>

<template>
  <div class="wrapper">
    <TabMenu
      class="card flex justify-content-center"
      style="width: 80%; display: flex; flex-wrap: wrap; margin: auto"
      v-model:activeIndex="active"
      :model="items"
    />
    <div
      v-if="isLoading"
      class="card flex justify-content-center"
      style="margin-top: 100px"
    >
      <ProgressSpinner></ProgressSpinner>
    </div>
    <div
      v-if="isLoaded"
      style="
        width: 80%;
        display: flex;
        flex-wrap: wrap;
        margin: auto;
        justify-content: center;
      "
    >
      <div
        v-for="image in tats.media"
        :key="image.id"
        class="card flex justify-content-center"
      >
        <!-- ADD IN LOADING SPINNER  -->

        <Image
          style="padding: 10px; object-fit: cover"
          width="400px"
          height="400px"
          :src="image.imgix_url + '?fit=crop&ar=1:1'"
          alt="Image"
          preview
        />
      </div>
    </div>
    <div class="card flex justify-content-center"></div>
    <Paginator
      v-model:first="first"
      :rows="9"
      :totalRecords="tats.total"
      @page="newPage"
    ></Paginator>
  </div>
  <div class="wrapperMobile">
    <div style="display: flex; padding: 20px; justify-content: right; align-items: center;">
        <ToggleButton v-model="showFilters" onLabel="Hide Filters" offLabel="Show Filters" />
        <!-- <Button @click="showFilters=!showFilters" icon="pi pi-filter" severity="secondary" text aria-label="Filter" /> -->
    </div>
    <div style="margin-bottom: 20px;" v-if="showFilters" class="card flex flex-wrap gap-3 justify-content-center">
        <div v-for="items in filters" :key=items.code class="flex align-items-center">
        <RadioButton v-model="selectedFilter" :inputId="items.code" name="filter" :value="items.name" />
        <label :for="items.code" class="ml-2">{{items.name}}</label>
    </div>
    </div>
<!-- 
    <div class="card flex justify-content-center">
    <Dropdown
      v-model="selectedFilter"
      :options="filters"
      optionLabel="name"
      placeholder="Select a Catagory"
      checkmark
      :highlightOnSelect="false"
      style="width: 80%;"
    />
    </div> -->
    <div
      v-if="isLoading"
      class="card flex justify-content-center"
      style="margin-top: 100px"
    >
      <ProgressSpinner></ProgressSpinner>
    </div>
    <div
      v-if="isLoaded"
      style="
        width: 80%;
        display: flex;
        flex-wrap: wrap;
        margin: auto;
        justify-content: center;
      "
    >
      <div
        v-for="image in tats.media"
        :key="image.id"
        class="card flex justify-content-center"
      >
        <!-- ADD IN LOADING SPINNER  -->

        <Image
          style="margin-bottom: 10px; object-fit: cover"
          width="400px"
          height="400px"
          :src="image.imgix_url + '?fit=crop&ar=1:1'"
          alt="Image"
          preview
        />
      </div>
    </div>
    <div class="card flex justify-content-center">
    <Paginator
      v-model:first="first"
      :rows="9"
      :totalRecords="tats.total"
      @page="newPage"
      template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
    ></Paginator>
</div>
  </div>
</template>

<style scoped>
@media only screen and (max-width: 1430px) {
  .wrapperMobile {
    display: block !important;
    width: 100%;
  }
  .wrapper {
    display: none !important;
  }
}
.wrapper {
    display: block;
}
.wrapperMobile {
    display: none;
}
div.gallery {
  margin: 5px;
  border: 1px solid #ccc;
  float: left;
  width: 20%;
}

div.gallery:hover {
  border: 1px solid #777;
}

div.gallery img {
  width: 100%;
  height: auto;
}

div.desc {
  padding: 15px;
  text-align: center;
}
</style>
