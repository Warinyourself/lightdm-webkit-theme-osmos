import { CONTOUR_SETTINGS }     from '@/components/themes/contour/constants'
import { ZAPPY_SETTINGS }       from '@/components/themes/zappy/constants'
import { RINGS3D_SETTINGS }     from '@/components/themes/rings3d/constants'
import { PLASMA_SETTINGS }      from '@/components/themes/plasma/constants'
import { FLOW_SETTINGS }        from '@/components/themes/flow/constants'
import { TUNNEL_SETTINGS }      from '@/components/themes/tunnel/constants'
import { PLANET_SETTINGS }      from '@/components/themes/planet/constants'
import { DESTRUCTION_SETTINGS } from '@/components/themes/destruction/constants'
import { RINGS_SETTINGS }       from '@/components/themes/rings/constants'
import { TENDERNESS_SETTINGS }  from '@/components/themes/tenderness/constants'
import { SPHERE_SETTINGS }      from '@/components/themes/sphere/constants'
import { RANDOM_SETTINGS }      from '@/components/themes/random/constants'
import type { AppTheme }        from '@/models/app'

export const defaultTheme: AppTheme = CONTOUR_SETTINGS

export const AppThemes: AppTheme[] = [
  CONTOUR_SETTINGS,
  ZAPPY_SETTINGS,
  RINGS3D_SETTINGS,
  PLASMA_SETTINGS,
  FLOW_SETTINGS,
  TUNNEL_SETTINGS,
  PLANET_SETTINGS,
  DESTRUCTION_SETTINGS,
  RINGS_SETTINGS,
  TENDERNESS_SETTINGS,
  SPHERE_SETTINGS,
  RANDOM_SETTINGS,
]
