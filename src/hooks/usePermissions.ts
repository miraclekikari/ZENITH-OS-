import { useState, useCallback, useEffect } from 'react';

type PermissionName = 'camera' | 'microphone';

export const usePermissions = (permissionName: PermissionName) => {
  const [permissionState, setPermissionState] = useState<PermissionState>('prompt');

  const checkPermission = useCallback(async () => {
    if (!navigator.permissions) return;
    try {
      const result = await navigator.permissions.query({ name: permissionName as any });
      setPermissionState(result.state);
      result.onchange = () => setPermissionState(result.state);
    } catch (error) {
      console.error(`Permission query for ${permissionName} failed`, error);
      if (permissionName === 'camera' || permissionName === 'microphone') {
          try {
              const stream = await navigator.mediaDevices.getUserMedia({ [permissionName]: true });
              // Stop the stream immediately after getting permission
              stream.getTracks().forEach(track => track.stop());
              setPermissionState('granted');
          } catch (userMediaError) {
              setPermissionState('denied');
          }
      }
    }
  }, [permissionName]);

  const requestPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ [permissionName]: true });
      // Stop the stream immediately after getting permission
      stream.getTracks().forEach(track => track.stop());
      checkPermission(); 
    } catch (error) {
      console.error(`Request for ${permissionName} failed`, error);
      setPermissionState('denied');
    }
  }, [permissionName, checkPermission]);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return { permissionState, requestPermission };
};
