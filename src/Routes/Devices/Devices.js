import React, {
  Fragment,
  useRef,
  useEffect,
  useContext,
  useState,
  Suspense,
} from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import { cleanEntities } from '../../store/actions';
import { RegistryContext } from '../../store';
import {
  isEmptyFilters,
  constructActiveFilters,
  onDeleteFilter,
} from '../../constants';
import { Tiles } from '../../components/Tiles';
import { Bullseye, Spinner } from '@patternfly/react-core';
import DeviceStatus from './DeviceStatus';

const UpdateDeviceModal = React.lazy(() =>
  import(/* webpackChunkName: "CreateImageWizard" */ './UpdateDeviceModal')
);

const defaultFilters = {
  deviceStatus: {
    label: 'Device status',
    value: [],
    titles: [],
  },
};

const deviceStatusMapper = [
  {
    value: 'approval',
    label: 'Required approval',
  },
  {
    value: 'ophaned',
    label: 'Orphaned',
  },
  {
    value: 'delivering',
    label: 'On the way',
  },
];

const Devices = () => {
  const [getEntities, setGetEntities] = useState();
  const [activeFilters, setActiveFilters] = useState(defaultFilters);
  const [updateModal, setUpdateModal] = useState({
    isOpen: false,
    imageId: null,
    deviceName: null,
  });
  const { getRegistry } = useContext(RegistryContext);
  const inventory = useRef(null);
  const history = useHistory();
  const dispatch = useDispatch();
  const onRefresh = (options, callback) => {
    if (!callback && inventory && inventory.current) {
      inventory.current.onRefreshData(options);
    } else if (callback) {
      callback(options);
    }
  };

  useEffect(() => {
    insights.chrome.registerModule('inventory');
    const searchParams = new URLSearchParams(history.location.search);
    if (searchParams.get('update_device') === 'true') {
      setUpdateModal((prevState) => {
        return {
          ...prevState,
          isOpen: true,
        };
      });
    }
    return () => dispatch(cleanEntities());
  }, []);

  return (
    <Fragment>
      <PageHeader className="pf-m-light">
        <PageHeaderTitle title="Fleet management" />
      </PageHeader>
      <Main className="edge-devices">
        <Tiles />
        <InventoryTable
          ref={inventory}
          onRefresh={onRefresh}
          tableProps={{
            canSelectAll: false,
            variant: 'compact',
          }}
          actions={[
            {
              title: 'Update',
              onClick: (_event, _index, { display_name: displayName }) => {
                setUpdateModal((prevState) => {
                  return {
                    ...prevState,
                    isOpen: true,
                    deviceName: displayName,
                  };
                });
              },
            },
          ]}
          columns={(defaultColumns) => {
            const newColumns = defaultColumns.filter((column) =>
              ['display_name', 'updated'].includes(column.key)
            );
            newColumns.filter((col) => col.key === 'updated')[0].props = {
              width: 20,
            };

            return [
              ...newColumns,
              {
                key: 'system_profile',
                title: 'Status',
                // eslint-disable-next-line react/display-name
                renderFunc: (sysProf, id) => (
                  <DeviceStatus id={id} systemProfile={sysProf} />
                ),
                props: { width: 20, isStatic: true },
              },
            ];
          }}
          getEntities={async (_i, config) => {
            const data = await getEntities(undefined, {
              ...config,
              filter: {
                ...config.filter,
                system_profile: {
                  ...config.filter?.system_profile,
                  host_type: 'edge',
                },
              },
              fields: {
                ...config?.fields,
                system_profile: [
                  ...(config?.fields?.system_profile || []),
                  'host_type',
                  'operating_system',
                  'greenboot_status',
                  'greenboot_fallback_detected',
                  'rpm_ostree_deployments',
                ],
              },
            });
            return data;
          }}
          hideFilters={{ registeredWith: true }}
          filterConfig={{
            items: [
              {
                label: activeFilters?.deviceStatus?.label,
                type: 'checkbox',
                filterValues: {
                  onChange: (event, value) => {
                    setActiveFilters(() => ({
                      ...(activeFilters || {}),
                      deviceStatus: {
                        ...(activeFilters?.deviceStatus || {}),
                        value,
                      },
                    }));
                    inventory.current.onRefreshData();
                  },
                  items: deviceStatusMapper,
                  value: activeFilters?.deviceStatus?.value || [],
                },
              },
            ],
          }}
          hasCheckbox={false}
          activeFiltersConfig={{
            ...(isEmptyFilters(activeFilters) && {
              filters: constructActiveFilters(
                activeFilters,
                (value) =>
                  deviceStatusMapper.find((item) => item.value === value)?.label
              ),
            }),
            onDelete: (event, itemsToRemove, isAll) => {
              if (isAll) {
                setActiveFilters(defaultFilters);
              } else {
                setActiveFilters(() =>
                  onDeleteFilter(activeFilters, itemsToRemove)
                );
              }
              inventory.current.onRefreshData();
            },
          }}
          onRowClick={(_e, id) => history.push(`/fleet-management/${id}`)}
          onLoad={({ mergeWithEntities, api }) => {
            setGetEntities(() => api?.getEntities);
            getRegistry()?.register?.({
              ...mergeWithEntities(),
            });
          }}
        />
      </Main>
      {updateModal.isOpen && (
        <Suspense
          fallback={
            <Bullseye>
              <Spinner />
            </Bullseye>
          }
        >
          <UpdateDeviceModal
            navigateBack={() => {
              history.push({ pathname: history.location.pathname });
              setUpdateModal((prevState) => {
                return {
                  ...prevState,
                  isOpen: false,
                };
              });
            }}
            setUpdateModal={setUpdateModal}
            updateModal={updateModal}
          />
        </Suspense>
      )}
    </Fragment>
  );
};

export default Devices;
