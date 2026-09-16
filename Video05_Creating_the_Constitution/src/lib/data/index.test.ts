import { describe, expect, test } from "vitest";
import {
  getAgent,
  getAgents,
  getAgentsForAilment,
  getAilment,
  getAilments,
  getAilmentsForAgent,
  getAilmentsForTherapy,
  getTherapies,
  getTherapiesForAilment,
  getTherapy,
} from "@/lib/data";

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

describe("ids", () => {
  test("are unique within each entity", () => {
    for (const ids of [
      getAgents().map((a) => a.id),
      getAilments().map((a) => a.id),
      getTherapies().map((t) => t.id),
    ]) {
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  test("are kebab-case slugs, because they become URLs", () => {
    for (const id of [
      ...getAgents().map((a) => a.id),
      ...getAilments().map((a) => a.id),
      ...getTherapies().map((t) => t.id),
    ]) {
      expect(id).toMatch(SLUG);
    }
  });
});

describe("referential integrity", () => {
  test("every ailment on an agent's chart exists", () => {
    for (const agent of getAgents()) {
      for (const ailmentId of agent.ailmentIds) {
        expect(getAilment(ailmentId), `${agent.id} -> ${ailmentId}`).toBeDefined();
      }
    }
  });

  test("every therapy on an ailment's list exists", () => {
    for (const ailment of getAilments()) {
      for (const therapyId of ailment.therapyIds) {
        expect(getTherapy(therapyId), `${ailment.id} -> ${therapyId}`).toBeDefined();
      }
    }
  });
});

describe("unknown ids", () => {
  test("return undefined rather than throwing", () => {
    expect(getAgent("nope")).toBeUndefined();
    expect(getAilment("nope")).toBeUndefined();
    expect(getTherapy("nope")).toBeUndefined();
  });

  test("yield empty relationship lists", () => {
    expect(getAilmentsForAgent("nope")).toEqual([]);
    expect(getAgentsForAilment("nope")).toEqual([]);
    expect(getTherapiesForAilment("nope")).toEqual([]);
    expect(getAilmentsForTherapy("nope")).toEqual([]);
  });
});

describe("derived reverse relationships", () => {
  test("agents <-> ailments agree in both directions", () => {
    for (const agent of getAgents()) {
      for (const ailment of getAilmentsForAgent(agent.id)) {
        const sufferers = getAgentsForAilment(ailment.id).map((a) => a.id);
        expect(sufferers, `${ailment.id} should list ${agent.id}`).toContain(agent.id);
      }
    }
  });

  test("ailments <-> therapies agree in both directions", () => {
    for (const ailment of getAilments()) {
      for (const therapy of getTherapiesForAilment(ailment.id)) {
        const treated = getAilmentsForTherapy(therapy.id).map((a) => a.id);
        expect(treated, `${therapy.id} should treat ${ailment.id}`).toContain(ailment.id);
      }
    }
  });
});

describe("the empty state has real data behind it", () => {
  test("one ailment has no agents and one therapy treats nothing", () => {
    expect(getAgentsForAilment("midnight-deploy-jitters")).toEqual([]);
    expect(getAilmentsForTherapy("temperature-regulation")).toEqual([]);
  });
});
