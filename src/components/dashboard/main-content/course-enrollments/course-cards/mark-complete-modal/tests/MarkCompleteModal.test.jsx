import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { AppContext } from '@edx/frontend-platform/react';

import MarkCompleteModal, { MARK_ARCHIVED_DEFAULT_LABEL, MARK_ARCHIVED_PENDING_LABEL } from '../MarkCompleteModal';
import * as service from '../data/service';

jest.mock('../data/service');

describe('<MarkCompleteModal />', () => {
  const initialProps = {
    isOpen: true,
    onSuccess: jest.fn(),
    onClose: jest.fn(),
    courseId: 'course-v1:my-test-course',
    courseTitle: 'edX Demonstration Course',
    courseLink: 'https://edx.org',
  };

  const enterpriseConfig = {
    uuid: 'example-enterprise-uuid',
  };

  it('handles confirm click with success', () => {
    service.markCourseAsCompleteRequest = jest.fn()
      .mockImplementation(() => Promise.resolve({
        data: {
          course_run_status: 'completed',
        },
      }));
    const wrapper = mount((
      <AppContext.Provider value={{ enterpriseConfig }}>
        <MarkCompleteModal
          {...initialProps}
        />
      </AppContext.Provider>
    ));
    wrapper.find('.confirm-mark-complete-btn').hostNodes().simulate('click');
    expect(service.updateCourseCompleteStatusRequest).toBeCalledWith({
      course_id: 'course-v1:my-test-course',
      enterprise_id: 'example-enterprise-uuid',
      marked_done: true,
    });
    expect(wrapper.find('.confirm-mark-complete-btn').hostNodes().text()).toEqual(MARK_ARCHIVED_PENDING_LABEL);
  });

  it('handles confirm click with error', async () => {
    service.markCourseAsCompleteRequest = jest.fn()
      .mockImplementation(() => Promise.reject(new Error('test error')));
    const wrapper = mount((
      <AppContext.Provider value={{ enterpriseConfig }}>
        <MarkCompleteModal
          {...initialProps}
        />
      </AppContext.Provider>
    ));
    await act(async () => {
      wrapper.find('.confirm-mark-complete-btn').hostNodes().simulate('click');
    });
    expect(service.updateCourseCompleteStatusRequest).toBeCalledWith({
      course_id: 'course-v1:my-test-course',
      enterprise_id: 'example-enterprise-uuid',
      marked_done: true,
    });
    expect(wrapper.find('.confirm-mark-complete-btn').hostNodes().text()).toEqual(MARK_ARCHIVED_DEFAULT_LABEL);
  });

  it('handles close modal', () => {
    const mockOnClose = jest.fn();
    const wrapper = mount((
      <AppContext.Provider value={{ enterpriseConfig }}>
        <MarkCompleteModal
          {...initialProps}
          onClose={mockOnClose}
        />
      </AppContext.Provider>
    ));
    act(() => {
      wrapper.find('.modal-footer button.js-close-modal-on-click').hostNodes().simulate('click');
    });
    expect(mockOnClose).toBeCalledTimes(1);
  });
});
