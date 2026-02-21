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
      // Fallback for browsers that don't support permissions.query for camera/mic
      setPermissionState('prompt'); 
    }
  }, [permissionName]);

  const requestPermission = useCallback(async () => {
    try {
      // Always request both audio and video to avoid errors
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      // Stop the stream immediately after getting permission to free up resources
      stream.getTracks().forEach(track => track.stop());
      // After a successful request, re-check the specific permission
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
