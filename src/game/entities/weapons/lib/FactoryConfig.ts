import { WeaponCarried } from './WeaponCarried'
import { WeaponOnGround } from './WeaponOnGround'

export interface WeaponFactoryConfig {
  dropEntity: typeof WeaponOnGround
  pickUpEntity: typeof WeaponCarried
}
