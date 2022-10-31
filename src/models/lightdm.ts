/* eslint-disable camelcase */
export interface ExpandedWindow {
  lightdm: Lightdm;
  authentication_complete(): void;
  lightdmLogin(
    username: string,
    password: string,
    callback: () => void,
  ): void;
  lightdmStart(desktop: string): void;
  show_prompt(text: string, type?: any): void;
  show_message(text: string, type: any): void;
}

export interface Lightdm {
  can_suspend: boolean;
  can_shutdown: boolean;
  can_restart: boolean;
  can_hibernate: boolean;
  is_authenticated: boolean;
  authentication_user?: string;
  default_session: string;
  sessions: LightdmSession[];
  users: LightdmUsers[];
  languages: LightdmLanguage[];
  language: string;
  start_authentication(username: string): void;
  authenticate(username: string): void;
  cancel_authentication(): void;
  respond(password: string): void;
  login(user: string, session: string): void;
  shutdown(): void;
  hibernate(): void;
  suspend(): void;
  restart(): void;
}

export interface LightdmUsers {
  display_name: string;
  username: string;
  image?: string;
}

export interface LightdmLanguage {
  name: string;
  code: string;
}

export interface LightdmSession {
  name: string;
  key: string;
  comment?: string;
}

export const appWindow = (window as unknown) as Window & ExpandedWindow
