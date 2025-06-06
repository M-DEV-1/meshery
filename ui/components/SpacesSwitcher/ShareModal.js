import { useUpdatePatternFileMutation } from '@/rtk-query/design';
import {
  useCreateAndRevokeResourceAccessRecordMutation,
  useGetAccessActorsInfoOfResourceQuery,
} from '@/rtk-query/resource';
import {
  useGetAllUsersQuery,
  useGetLoggedInUserQuery,
  useGetUserProfileSummaryByIdQuery,
} from '@/rtk-query/user';
import { useUpdateViewVisibilityMutation } from '@/rtk-query/view';
import { useNotification } from '@/utils/hooks/useNotification';
import { ShareModal as CatalogShare } from '@sistent/sistent';
import { getShareableResourceRoute } from './hooks';
import { JsonParse } from '@/utils/utils';
import { MESHERY_CLOUD_PROD } from '@/constants/endpoints';
import { RESOURCE_TYPE } from '@/utils/Enum';

export const ShareModal_ = ({ selectedResource, dataName, handleShareModalClose }) => {
  const firstSelectedResource = Array.isArray(selectedResource)
    ? selectedResource[0]
    : selectedResource;
  const resourceType = dataName === 'design' ? 'pattern' : dataName;

  const { data: ownerData, isSuccess: isOwnerDataFetched } = useGetUserProfileSummaryByIdQuery({
    id: firstSelectedResource?.user_id,
  });

  const { data: accessActorsInfoOfResource, isSuccess: accessActorsFetched } =
    useGetAccessActorsInfoOfResourceQuery({
      resourceId: firstSelectedResource?.id,
      resourceType: resourceType,
      actorType: 'users',
    });

  const { notify } = useNotification();
  const { data: currentUser } = useGetLoggedInUserQuery();
  const [updatePatterns] = useUpdatePatternFileMutation();
  const [handleResourceShare] = useCreateAndRevokeResourceAccessRecordMutation();
  const [updateView] = useUpdateViewVisibilityMutation();

  /**
   * Determines if the visibility of the selected resource can be edited.
   * @returns {boolean} - `true` if the visibility can be edited, otherwise `false`.
   */

  const fetchAccessActors = () => {
    if (accessActorsFetched && isOwnerDataFetched) {
      return [ownerData, ...accessActorsInfoOfResource.users];
    }
    return [];
  };
  const shareableLink = getShareableResourceRoute(
    dataName,
    firstSelectedResource?.id,
    firstSelectedResource?.name,
  );

  const handleUpdatePatternVisibility = async (value) => {
    const res = await updatePatterns({
      body: {
        id: firstSelectedResource?.id,
        name: firstSelectedResource?.name,
        catalog_data: firstSelectedResource?.catalog_data,
        design_file: JsonParse(firstSelectedResource?.pattern_file),
        visibility: value,
      },
    });
    return {
      error: res?.error?.error,
    };
  };

  const handleUpdateViewVisibility = async (value) => {
    const res = await updateView({
      id: firstSelectedResource?.id,
      body: {
        visibility: value,
      },
    });
    return {
      error: res.error?.error,
    };
  };

  const handleUpdateVisibility = (updatedVisibility) => {
    if (dataName == RESOURCE_TYPE.DESIGN) {
      return handleUpdatePatternVisibility(updatedVisibility);
    }

    if (dataName == RESOURCE_TYPE.VIEW) {
      return handleUpdateViewVisibility(updatedVisibility);
    }
  };
  return (
    <CatalogShare
      selectedResource={selectedResource}
      dataName={dataName}
      resourceAccessMutator={handleResourceShare}
      notify={notify}
      handleShareModalClose={handleShareModalClose}
      currentUser={currentUser}
      shareableLink={shareableLink}
      useGetAllUsersQuery={useGetAllUsersQuery}
      ownerData={{ ...ownerData, user_id: ownerData?.id }}
      fetchAccessActors={fetchAccessActors}
      hostURL={MESHERY_CLOUD_PROD}
      handleUpdateVisibility={handleUpdateVisibility}
      accessActorsInfoOfResource={accessActorsInfoOfResource?.users}
    />
  );
};

const ShareModal = ({ resource, type, handleClose }) => {
  return (
    <ShareModal_ handleShareModalClose={handleClose} selectedResource={resource} dataName={type} />
  );
};

export default ShareModal;
