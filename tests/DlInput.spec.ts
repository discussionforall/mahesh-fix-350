import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeAll } from 'vitest'
import { DlInput } from '../src/components'

describe('DlInput component', () => {
    it('should mount the component', () => {
        const wrapper = mount(DlInput)

        expect(wrapper.exists()).toBe(true)
    })

    it('should have the correct classes', async () => {
        const wrapper = mount(DlInput, {
            slots: {
                prepend: '<p>Slot</p>'
            },
            props: {
                size: 'l'
            }
        })

        expect(wrapper.find('input').classes()).toContain(
            'dl-text-input__input--prepend'
        )

        await wrapper.setProps({ error: true })
        expect(wrapper.find('input').classes()).toContain(
            'dl-text-input__input--error'
        )

        await wrapper.setProps({ redAsterisk: true })
        expect(wrapper.find('.dl-text-input__asterisk').classes()).toContain(
            'dl-text-input__asterisk--red'
        )

        await wrapper.setProps({ type: 'password' })
        await wrapper
            .findComponent({ ref: 'input-show-pass-button' })
            .find('.dl-button')
            .trigger('click')

        const showPass = wrapper.vm.$data.showPass

        expect(showPass).toEqual(true)
    })

    it('should trigger the correct events', async () => {
        const wrapper = mount(DlInput)

        await wrapper.find('input').trigger('input')

        const inputEvent: any = wrapper.emitted('input')
        expect(inputEvent).toHaveLength(1)

        await wrapper.find('input').trigger('blur')
        // @ts-ignore // handled in jest setup
        await window.delay(50)
        await wrapper.vm.$nextTick()

        const blurEvent: any = wrapper.emitted('blur')
        expect(blurEvent).toHaveLength(1)

        await wrapper.find('input').trigger('focus')
        // @ts-ignore // handled in jest setup
        await window.delay(50)
        await wrapper.vm.$nextTick()

        const focusEvent: any = wrapper.emitted('focus')
        expect(focusEvent).toHaveLength(1)

        await wrapper.find('input').trigger('keyup.enter')

        const enterEvent: any = wrapper.emitted('enter')
        expect(enterEvent).toHaveLength(1)

        await wrapper
            .findComponent({ ref: 'input-clear-button' })
            .find('.dl-button')
            .trigger('click')

        const clearEvent: any = wrapper.emitted('clear')
        expect(clearEvent).toHaveLength(1)
        const clearButtonInputEvent: any = wrapper.emitted('input')
        expect(clearButtonInputEvent).toHaveLength(2)
    })

    describe(`When there's a warning`, () => {
        const wrapper = mount(DlInput, { props: { warning: true } })

        describe(`When there's no error message`, () => {
            it(`should show the warning only`, async () => {
                expect(wrapper.find('input').classes()).toContain(
                    'dl-text-input__input--warning'
                )
            })
        })

        describe(`When there's also an error`, () => {
            beforeAll(async () => {
                await wrapper.setProps({ error: true })
            })
            it(`should show the error only`, () => {
                expect(wrapper.find('input').classes()).toContain(
                    'dl-text-input__input--error'
                )
                expect(wrapper.find('input').classes()).not.toContain(
                    'dl-text-input__input--warning'
                )
            })
        })
    })
    /**
     * TODO: Find a way to test this
     */
    describe.skip(`Trigger blur() method`, () => {
        const wrapper = mount(DlInput)

        describe(`When blur() method is triggered`, () => {
            beforeAll(async () => {
                await wrapper.vm.blur()
                await wrapper.vm.$nextTick()
            })
            it(`should emit 'blur' event`, () => {
                const focusEvent: any = wrapper.emitted('blur')
                expect(focusEvent).toHaveLength(1)
            })
        })
    })
    /**
     * TODO: Find a way to test this
     */
    describe.skip(`Trigger focus() method`, () => {
        // Should be skipped until we find a way to test this
        const wrapper = mount(DlInput)

        describe(`When focus() method is triggered`, () => {
            beforeAll(async () => {
                await wrapper.vm.focus()
                await wrapper.vm.$nextTick()
            })
            it(`should emit 'focus' event`, () => {
                const focusEvent: any = wrapper.emitted('focus')
                expect(focusEvent).toHaveLength(1)
            })
        })
    })
})
