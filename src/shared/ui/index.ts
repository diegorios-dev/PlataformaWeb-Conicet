// ============================================
// ATOMIC DESIGN - SHARED UI COMPONENTS
// ============================================

// --------------- ATOMS ---------------
export { ButtonLoading } from './atoms/Button';
export { Badge } from './atoms/Badge';
export { Input } from './atoms/Input';
export type { InputProps } from './atoms/Input';
export { Select } from './atoms/Select';
export type { SelectProps } from './atoms/Select';
export { Textarea } from './atoms/Textarea';
export type { TextareaProps } from './atoms/Textarea';

// --------------- MOLECULES ---------------
export { SearchBar } from './molecules/SearchBar';
export { FilterDropdown } from './molecules/FilterDropdown';
export type { FilterOption } from './molecules/FilterDropdown';
export { Card } from './molecules/Card';
export { YearPicker } from './molecules/YearPicker';
export { FormField } from './molecules/FormField';
export type { FormFieldProps } from './molecules/FormField';
export { ImageInput } from './molecules/ImageInput';
export type { ImageInputProps } from './molecules/ImageInput';
export { AudioInput } from './molecules/AudioInput';
export type { AudioInputProps } from './molecules/AudioInput';
export { ConfirmationModal } from './molecules/ConfirmationModal';
export type { ConfirmationModalProps } from './molecules/ConfirmationModal';
export { InfoBox } from './molecules/InfoBox';
export type { InfoBoxProps } from './molecules/InfoBox';

// --------------- LAYOUTS ---------------
export { DashboardLayout } from './layouts/DashboardLayout';
export type { DashboardLayoutProps } from './layouts/DashboardLayout';

// --------------- LOADING STATES ---------------
export { default as Toast } from './Loading/Toast';
export { LoadingSpinner, LoadingMap, EmptyState } from './Loading/LoadingState';

// --------------- ERROR HANDLING ---------------
export { ErrorBoundary } from './ErrorBoundary';
