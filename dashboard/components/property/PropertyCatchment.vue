<template>
  <section class="property-catchment">
    <h3 class="section-title">School Catchment Information</h3>
    <p class="my-3">
      According to local education authority information this school is in the catchment area for the following public schools:
    </p>
    <v-data-table
      :headers="headers"
      :items="schools"
      hide-actions
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.name }}</td>
        <td>{{ props.item.level }}</td>
        <td>{{ props.item.address }}</td>
        <td class="text-xs-right">{{ props.item.totalStudents }}</td>
      </template>
    </v-data-table>
  </section>
</template>

<script>
export default {
  name: 'PropertyCatchment',
  props: ['property'],
  data () {
    return {
      headers: [
        {
          text: 'Name',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        {
          text: 'Level',
          align: 'left',
          sortable: false,
          value: 'level'
        },
        {
          text: 'Address',
          align: 'left',
          sortable: false,
          value: 'address'
        },
        {
          text: '# of Students',
          align: 'right',
          value: 'totalStudents'
        }
      ]
    }
  },
  computed: {
    schools () {
      if (this.property && this.property.services) {
        return this.property.services.map(s => ({
          name: s.school_name,
          level: s.level_of_schooling,
          address: s.street,
          totalStudents: parseInt(s.student_number)
        }))
      }
      return []
    }
  }
}
</script>

<style scoped>
.property-catchment {
  margin-top: 40px;
}
</style>
