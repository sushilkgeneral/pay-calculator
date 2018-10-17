import React from 'react';
import { mount, shallow } from 'enzyme';
import Calculator from './';

describe('pages/Calculator', () => {
    describe('render', () => {
        it('should render the right elements', () => {
            const component = mount(<Calculator />);

            expect(component.find('.Dropdown-root')).toHaveLength(3);
            expect(component.find('h1')).toHaveLength(1);
            expect(component.find('button')).toHaveLength(1);
        });
    });

    describe('handleChange function', () => {
        it('updates the correct value in the state', () => {
            const wrapper = shallow(<Calculator/>);
            const instance = wrapper.instance();
            wrapper.setState({
                startTime: null,
                endTime: null,
                pay: '99',
                error: 'some error'
            });

            spyOn(instance, 'setState'); // eslint-disable-line no-undef

            instance.handleChange('startTime', 1);

            expect(instance.setState).toHaveBeenCalledWith({error: null, pay: null, startTime: 1});
        });

        it('resets endTime if end time is previously selected & start time is modified to a time later than end time', () => {
            const wrapper = shallow(<Calculator/>);
            const instance = wrapper.instance();
            wrapper.setState({
                startTime: null,
                endTime: { value: 5 },
                pay: '99',
                error: 'some error'
            });

            spyOn(instance, 'setState'); // eslint-disable-line no-undef

            instance.handleChange('startTime', { value: 6 });

            expect(instance.setState).toHaveBeenCalledWith({error: null, pay: null, startTime: { value: 6 }, endTime: null});
        });
    })
});