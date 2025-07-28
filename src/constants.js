export const FORM_FIELDS = {
    CAMERA: 'camera',
    ROLL: 'roll',
    TAKE: 'take',
    TIMESTAMP: 'timestamp',
    TIMECODE: 'timecode',
    CLIPS: 'clips',
    LENS: 'lens',
    FILTER: 'filter',
    LUT: 'lut',
    F_STOP: 'fStop',
    SHUTTER: 'shutter',
    ISO: 'iso',
    WHITE_BALANCE: 'whiteBalance',
    NOTES: 'notes',
    CIRCLED: 'circled',
    USER: 'user',
    SCENE: 'scene',
    SHOT: 'shot',
    SLATE: 'slate'
};

export const CAMERA_OPTIONS = ['A-Cam', 'B-Cam', 'C-Cam', 'Drone', 'Steady'];
export const LENS_OPTIONS = ['35mm', '50mm', '85mm', '24-70mm', '70-200mm', '50mm Anamorphic'];
export const FILTER_OPTIONS = ['None', 'ND0.3', 'ND0.6', 'ND0.9', 'ND1.2', 'Polarizer'];
export const LUT_OPTIONS = ['LUT1', 'LUT2', 'Rec709', 'LogC', 'Custom'];
export const F_STOP_OPTIONS = ['f/1.4', 'f/2', 'f/2.8', 'f/4', 'f/5.6', 'f/8', 'f/11', 'f/16'];
export const SHUTTER_OPTIONS = ['1/50', '1/100', '1/200', '180°', '360°'];
export const WB_OPTIONS = ['3200K', '4300K', '5600K', '6500K', 'Custom'];

export const STORAGE_KEY = 'cameraLogs';
export const LAST_VALUES_KEY = 'lastFormValues';
