<template>
    <div class="uploaderEditor">
        <Field name="url" label="URL" :item="item" @blur="updateURL" />
        <Field name="method" label="Method" :item="item">
            <select @change="setMethod">
                <option
                    v-for="method in methods"
                    :key="method"
                    :value="method"
                    :selected="method === item.method"
                >
                    {{ method }}
                </option>
            </select>
        </Field>
        <Field name="query" :item="item">
            <QueryManager :item="item" />
        </Field>
        <Field name="headers" :item="item">
            <HeaderManager :item="item" />
        </Field>
        <Field name="body" :item="item">
            <div class="subTitle">Body Type</div>
            <select @change="setBodyType" style="margin-bottom: 0.4em">
                <option
                    v-for="type in bodyTypes"
                    :key="type.label"
                    :value="type.value"
                    :selected="bodyType.label === type.label"
                >
                    {{ type.label }}{{ type.value ? ` (${type.value})` : '' }}
                </option>
            </select>
            <BodyManager
                :item="item"
                v-if="bodyType.props"
            />
            <textarea
                    rows="5"
                    v-else-if="bodyType.text"
                    @keydown="onTextAreaKeyDown"
                    @blur="updateBody" />
        </Field>
        <Field
            name="formName"
            label="Form Name"
            :item="item"
            v-if="item.body.type === 'multipart/form-data'"
            @blur="updateFormName"
        />
        <div class="subTitle">Response</div>
        <Field name="responseURL" label="URL" :item="item" @blur="updateResponseURL" />
        <Field name="deletionURL" label="Deletion URL" :item="item" @blur="updateDeletionURL" />
        <Field name="errorMessage" label="Error Message" :item="item" @blur="updateErrorMessage" />
    </div>
</template>

<script>
import ItemAdder from '../ItemAdder.vue'
import Field from './Field.vue'
import QueryManager from './QueryManager.vue'
import HeaderManager from './HeaderManager.vue'
import BodyManager from './BodyManager.vue'

export default {
    components: {
        Field,
        ItemAdder,
        QueryManager,
        HeaderManager,
        BodyManager,
    },
    props: ['item'],
    data() {
        return {
            methods: [
                'GET',
                'POST',
                'PUT',
                'DELETE',
                'PATCH',
            ],
            bodyTypes: [
                {
                    label: 'No body',
                    value: null,
                },
                {
                    label: 'Form URL encoded',
                    value: 'application/x-www-form-urlencoded',
                    props: true,
                },
                {
                    label: 'Form data',
                    value: 'multipart/form-data',
                    props: true,
                },
                {
                    label: 'JSON',
                    value: 'application/json',
                    props: true,
                },
                {
                    label: 'XML',
                    value: 'application/xml',
                    text: true,
                }
            ],
        }
    },
    computed: {
        bodyType() {
            const type = this.item.body.type

            return this.bodyTypes.find((bodyType) => bodyType.value === type)
        }
    },
    methods: {
        setMethod(e) {
            this.$store.commit('updateMethod', {
                method: e.target.value,
                uploader: this.item,
            })
        },
        setBodyType(e) {
            this.$store.commit('updateBodyType', {
                type: e.target.value || null,
                uploader: this.item,
            })
        },
        updateBody(e) {
            this.$store.commit('updateBodyValue', {
                value: e.target.value || '',
                uploader: this.item,
            })
        },
        updateURL(e) {
            this.$store.commit('updateUploaderURL', {
                url: e.target.value,
                uploader: this.item,
            })
        },
        updateFormName(e) {
            this.$store.commit('updateFormName', {
                formName: e.target.value,
                uploader: this.item,
            })
        },
        updateResponseURL(e) {
            this.$store.commit('updateResponseURL', {
                url: e.target.value,
                uploader: this.item,
            })
        },
        updateDeletionURL(e) {
            this.$store.commit('updateDeletionURL', {
                url: e.target.value,
                uploader: this.item,
            })
        },
        updateErrorMessage(e) {
            this.$store.commit('updateErrorMessage', {
                error: e.target.value,
                uploader: this.item,
            })
        },
        onTextAreaKeyDown(e) {
            if (e.key === 'Tab') {
                e.preventDefault()
                e.target.value += '    '
            }
        },
    },
}
</script>

<style scoped>
.uploaderEditor {
    width: 100%;
}
.subTitle {
    font-weight: bold;
    margin-bottom: 0.4em;
}
::v-deep(.dualSelector input) {
    width: 45%
}

textarea {
    width: 100%;
    outline: none;
    border: 1px solid #fff;
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.2);
    color: #fff;
}
</style>