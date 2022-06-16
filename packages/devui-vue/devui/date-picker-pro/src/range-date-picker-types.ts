import type { ComputedRef, ExtractPropTypes, PropType, Ref } from 'vue';
import type { Dayjs } from 'dayjs';

export const rangeDatePickerProProps = {
  modelValue: {
    type: Array as PropType<(Date | string)[]>,
    default: ['', ''],
  },
  format: {
    type: String,
    default: 'YYYY/MM/DD',
  },
  placeholder: {
    type: Array as PropType<string[]>,
    default: ['请选择日期', '请选择日期'],
  },
  showTime: {
    type: Boolean,
    default: false,
  },
  separator: {
    type: String,
    default: '-',
  },
} as const;

export type RangeDatePickerProProps = ExtractPropTypes<typeof rangeDatePickerProProps>;

export interface UseRangePickerProReturnType {
  containerRef: Ref<HTMLElement | undefined>;
  originRef: Ref<HTMLElement | undefined>;
  startInputRef: Ref<HTMLElement | undefined>;
  endInputRef: Ref<HTMLElement | undefined>;
  overlayRef: Ref<HTMLElement | undefined>;
  isPanelShow: Ref<boolean>;
  placeholder: ComputedRef<string[]>;
  dateValue: ComputedRef<(Dayjs | undefined)[]>;
  displayDateValue: ComputedRef<string[]>;
  isMouseEnter: Ref<boolean>;
  showCloseIcon: ComputedRef<boolean>;
  focusType: Ref<string>;
  onFocus: (type: string) => void;
  onSelectedDate: (date: Dayjs[], isConfirm?: boolean) => void;
  handlerClearTime: (e: MouseEvent) => void;
  onChangeRangeFocusType: (type: string) => void;
}
