<template>
  <div class="service-edit-modal">
    <div class="modal-header">
      <h3 class="text-left">Edit Subtype Scoring Rule in Suburb</h3>
      <hr class="green-line"/>
    </div>
    <div class="modal-body">
      <div class="row form-group">
        <div class="col-sm-6 d-flex align-center">
          <label class="control-label">Category:</label>
          <input type="text" readonly v-model="scoringRuleCategory" name="scoringRuleCategory">
        </div>
      </div>
      <div class="row form-group">
        <div class="col-sm-6 d-flex align-center">
          <label class="control-label">Type:</label>
          <input type="text" readonly v-model="scoringRuleType" name="scoringRuleType">
        </div>
        <div class="col-sm-6 d-flex align-center">
          <label class="control-label">Sub-Type:</label>
          <input type="text" readonly v-model="scoringRuleSubtype" name="scoringRuleSubtype">
        </div>
      </div>
      <div class="row form-group">
        <div class="col-sm-6 d-flex align-center">
          <label class="control-label">Calculation Method:</label>
          <el-select
            v-model="calculationMethodObject"
            class="fluid"
            placeholder="Select Calculation Method"
            noDataText="No data"
            @change="ruleEditedChange"
          >
            <el-option v-for="item in calculationMethodsOptions"
                        :key="item.value"
                        :label="item.text"
                        :value="item"
                        />
          </el-select>
        </div>
      </div>
    </div>
    <div class="modal-footer mt-3 pt-3 px-0 d-flex justify-end align-center">
      <button class="btn btn-primary mx-3" @click="onSaveClicked">Save</button>
      <button class="btn btn-default" @click="onCancelClicked">Cancel</button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import VueTagsInput from '@johmun/vue-tags-input'
import VueGoogleAutocomplete from 'vue-google-autocomplete'

import { SAVE_SCORING_RULE } from '@/store/action-types'

export default {
  name: 'ScoringRuleEdit',
  components: {
    VueTagsInput,
    VueGoogleAutocomplete
  },
  props: {
    scoringRule: {
      type: Object,
      default: () => ({})
    },
    suburbId: {
      type: Object
    }
  },
  data () {
    return {
      scoringRule_id: null,
      scoringRuleCategory: '',
      scoringRuleCategoryCode: '',
      scoringRuleType: '',
      scoringRuleTypeCode: '',
      scoringRuleSubtype: '',
      scoringRuleSubtypeCode: '',
      postCode: '',
      calculationMethodsList: [],
      calculationMethodObject: {},
      calculationMethod: '',
      calculationMethodCode: '',
      ruleEdited: null
    }
  },
  created () {
    this.scoringRule_id = this.scoringRule._id
    this.scoringRuleCategory = this.scoringRule.categoryName
    this.scoringRuleCategoryCode = this.scoringRule.categoryCode
    this.scoringRuleType = this.scoringRule.typeName
    this.scoringRuleTypeCode = this.scoringRule.typeCode
    this.calculationMethod = this.scoringRule.calculationMethod
    this.calculationMethodCode = this.scoringRule.calculationMethodCode
    this.scoringRuleSubtype = this.scoringRule.subTypeName
    this.scoringRuleSubtypeCode = this.scoringRule.subTypeCode
    this.postCode = this.scoringRule.postCode
    this.ruleEdited = false
    this.calculationMethodObject = {
      text: this.calculationMethod,
      code: this.calculationMethodCode
    }
  },
  mounted () {

  },
  computed: {
    ...mapState({
      proximityRules: state => state.proximityRule.rules,
      serviceClassification: state => state.reference.serviceClassification,
      calculationMethods: state => state.scoringRule.calculationMethods,
      scoringRules: state => state.scoringRule.scoringRules

    }),
    calculationMethodsOptions () {
      let rules = [{value: '', text: ''}]
      if (this.calculationMethods) {
        rules = this.calculationMethods.map(o => ({ value: o.code, text: o.name, type: o.type, number: o.number }))
      }
      return rules
    }
  },
  methods: {
    onSaveClicked () {
      if (!this.ruleEdited) {
        if (!this.calculationMethodObject.text || !this.scoringRuleTypeObject.text) {
          this.$snack.danger({
            text: 'Input Error! The Calculation Method field or Scoring Rule Type is empty',
            button: 'OK'
          })
          return
        }
        this.$emit('close')
      }
      const scoringRule = {
        _id: this.scoringRule_id,
        categoryName: this.scoringRuleCategory,
        categoryCode: this.scoringRuleCategoryCode,
        typeName: this.scoringRuleType,
        typeCode: this.scoringRuleTypeCode,
        subTypeName: this.scoringRuleSubtype,
        subTypeCode: this.scoringRuleSubtypeCode,
        calculationMethodName: this.calculationMethodObject.text,
        calculationMethodCode: this.calculationMethodObject.value,
        postCode: this.postCode,
        uuid: this.scoringRule.uuid,
        ruleEdited: this.ruleEdited
      }
      if (!this.calculationMethodObject.text) {
        this.$snack.danger({
          text: 'Input Error! The Calculation Method field or Scoring Rule Type is empty',
          button: 'OK'
        })
        return
      }
      let scoringRules = this.scoringRules
      this.$store.dispatch(SAVE_SCORING_RULE, { scoringRule, scoringRules })
      this.$emit('close')
    },
    onCancelClicked () {
      this.$emit('close')
    },
    saveTypeCode (code) {
      this.scoringRuleTypeCode = code
    },
    ruleEditedChange () {
      this.ruleEdited = true
    }
  }
}
</script>

<style scoped>
.service-edit-modal {
  padding: 24px;
}
button {
  min-width: 100px;
}
.modal-header {
  padding: 0;
  border-bottom: none;
}
.service-edit-modal >>> .new-tag-input-wrapper input {
  height: auto;
}
.service-edit-modal >>> .tag {
  background-color: #27ae60;
}
.control-label {
  min-width: 140px;
}
</style>
