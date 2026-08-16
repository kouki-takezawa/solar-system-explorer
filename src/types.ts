export interface EntityFact {
  label: string;
  value: string;
}

export type ScaleLevel = 'solar' | 'stellar' | 'galaxy' | 'universe';

/** Generic selectable/clickable thing shown in the sidebar outside the solar-system level. */
export interface Entity {
  id: string;
  nameJa: string;
  nameEn: string;
  color: string;
  description: string;
  facts: EntityFact[];
  /** If set, this entity represents the content of a smaller scale level -- offer a "zoom into it" jump. */
  drillTarget?: ScaleLevel;
}
