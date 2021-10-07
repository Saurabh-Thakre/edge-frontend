import React from 'react';
import {
  TextContent,
  TextList,
  TextListItem,
  TextListItemVariants,
  TextListVariants,
} from '@patternfly/react-core';
import { useSelector, shallowEqual } from 'react-redux';
import DateFormat from '@redhat-cloud-services/frontend-components/DateFormat';
import { distributionMapper, imageTypeMapper } from './constants';

const ImageDetailTab = () => {
  const { data } = useSelector(
    ({ imageDetailReducer }) => ({ data: imageDetailReducer?.data || null }),
    shallowEqual
  );

  const dateFormat = () => <DateFormat date={data['created_at']} />;
  const labelsToValueMapper = {
    'Image name': 'name',
    Version: 'version',
    Created: () => dateFormat(),
    Release: () => distributionMapper[data['distribution']],
    'Output type': () => imageTypeMapper[data['image_type']],
    'Added packages': () => data.Commit.packages.length,
  };

  if (data?.Installer?.checksum) {
    labelsToValueMapper['SHA-256 Checksum'] = () => data?.Installer?.checksum;
  }

  return (
    <TextContent className="pf-u-ml-lg pf-u-mt-md">
      <TextList component={TextListVariants.dl}>
        {data
          ? Object.entries(labelsToValueMapper).map(([label, value]) => {
              return (
                <>
                  <TextListItem component={TextListItemVariants.dt}>
                    {label}
                  </TextListItem>
                  <TextListItem component={TextListItemVariants.dd}>
                    {typeof value === 'function' ? value() : data[value]}
                  </TextListItem>
                </>
              );
            })
          : null}
      </TextList>
    </TextContent>
  );
};

export default ImageDetailTab;