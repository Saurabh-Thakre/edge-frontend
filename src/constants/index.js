import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusCircleIcon,
  UnknownIcon,
  RepositoryIcon,
  SearchIcon,
  ModuleIcon,
  CubeIcon,
  TimesCircleIcon,
  InProgressIcon,
  QuestionCircleIcon,
} from '@patternfly/react-icons';

import dangerColor from '@patternfly/react-tokens/dist/esm/global_danger_color_100';
import warningColor from '@patternfly/react-tokens/dist/esm/global_warning_color_100';
import successColor from '@patternfly/react-tokens/dist/esm/global_success_color_100';
import infoColor from '@patternfly/react-tokens/dist/esm/global_info_color_100';
import activeColor from '@patternfly/react-tokens/dist/esm/global_active_color_100';

export const statusMapper = [
  'done',
  'error',
  'pending',
  'unknown',
  'updating',
  'warning',
  'notification',
];

export const sortByDirection = (data, direction = 'asc') =>
  data.sort((a, b) =>
    direction === 'asc'
      ? a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      : b.name.toLowerCase().localeCompare(a.name.toLowerCase())
  );

export const deviceSummaryMapper = [
  'active',
  'noReports',
  'neverReported',
  'orphaned',
];

export const imageDistributionMapper = {
  'rhel-8.1': 'RHEL 8.1',
  'rhel-8.2': 'RHEL 8.2',
  'rhel-8.3': 'RHEL 8.3',
};

export const composeStatus = [
  'CREATED',
  'BUILDING',
  'ERROR',
  'SUCCESS',
  'INTERRUPTED',
];

export const distributionMapper = {
  'rhel-84': 'RHEL 8.4',
  'rhel-85': 'RHEL 8.5',
  'rhel-86': 'RHEL 8.6',
  'rhel-90': 'RHEL 9.0',
};

export const releaseMapper = {
  'rhel-90': 'Red Hat Enterprise Linux (RHEL) 9.0',
  'rhel-86': 'Red Hat Enterprise Linux (RHEL) 8.6',
  'rhel-85': 'Red Hat Enterprise Linux (RHEL) 8.5',
  'rhel-84': 'Red Hat Enterprise Linux (RHEL) 8.4',
};

export const supportedReleases = ['rhel-84', 'rhel-85'];

export const temporaryReleases = ['rhel-86', 'rhel-90'];

export const DEFAULT_RELEASE = 'rhel-85';
export const TEMPORARY_RELEASE = 'rhel-90';

export const imageTypeMapper = {
  'rhel-edge-commit': 'RHEL for Edge Commit (.tar)',
  'rhel-edge-installer': 'RHEL for Edge Installer (.iso)',
};

export const iconMapper = {
  unknown: UnknownIcon,
  repository: RepositoryIcon,
  search: SearchIcon,
  module: ModuleIcon,
  cube: CubeIcon,
  question: QuestionCircleIcon,
  plus: PlusCircleIcon,
  checkCircle: CheckCircleIcon,
  exclamationTriangle: ExclamationTriangleIcon,
  timesCircle: TimesCircleIcon,
  inProgress: InProgressIcon,
};

export const colorMapper = {
  green: successColor.value,
  yellow: warningColor.value,
  lightBlue: infoColor.value,
  blue: activeColor.value,
  red: dangerColor.value,
};
