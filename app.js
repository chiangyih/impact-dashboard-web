(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const NS = "http://www.w3.org/2000/svg";
  const SYNTHETIC_NOTICE = "SYNTHETIC／合成資料；本機 fixture，非實測、校正或材料驗收。";
  const REASON_LABELS = {
    DT_MISMATCH_SYNTHETIC: "dt 與兩閘時間差不一致（合成反例）",
    DISTANCE_UNCERTAINTY_NOT_VERIFIED: "設定距離的不確定度尚未驗證",
    NO_ADC_RECORDS: "此模式沒有 ACC／HX ADC 紀錄",
    METHOD_NOT_QUALIFIED: "方法與資格尚未建立",
    HX_UNCALIBRATED_RAW_ONLY: "HX 僅提供 RAW counts，未校正",
    NO_FORCE_SENSOR_SOURCE: "沒有力感測來源",
    NO_SYNCHRONIZED_FORCE_SOURCE: "沒有同步力資料來源",
    NO_VALIDATED_EVENT_WINDOW: "沒有通過驗證的事件窗口",
    NO_ENERGY_BALANCE: "沒有可用的能量收支證據",
    NO_QUALIFIED_SRS_INPUT: "沒有具資格的 SRS 輸入",
    NO_SPECIMEN_COMPARISON_EVIDENCE: "沒有試片比較證據",
    SOURCE_AGE_UNPROVEN: "來源 age／clock 無法證明",
    SOURCE_TTL_EXCEEDED: "來源資料已超過合成 TTL",
    SOURCE_CLOCK_MAPPING_UNKNOWN: "來源時鐘映射未知",
    SYNTHETIC_ONLY: "僅供本機合成展示",
    VIEW_WINDOW_GAP: "合成訊息窗口有缺口",
    DISTANCE_NOT_VERIFIED: "觸發間距尚未獨立驗證"
  };

  const historyBundles = {
    DEMO_RUN_TRIAL_001: makeHistoryBundle({
      runId: "DEMO_RUN_TRIAL_001",
      snapshot: "demo-snapshot-trial-1",
      publication: "demo-publication-trial-1",
      published: "2026-10-30T08:40:00Z",
      mode: "TRIAL",
      firmware: "demo-fw-rmt2",
      profile: "demo-profile-trial-v1",
      clockId: "DEMO_CLOCK_TRIAL_01",
      clockOrigin: "ARM_RELATIVE",
      fixtureId: "DEMO_FIXTURE_TRIAL_001",
      acc: [
        { saved_record_index: 0, t_read_us: 0, x_raw: 0, y_raw: -5, z_raw: 101 },
        { saved_record_index: 1, t_read_us: 2000, x_raw: 18, y_raw: -2, z_raw: 115 },
        { saved_record_index: 2, t_read_us: 4000, x_raw: -24, y_raw: 0, z_raw: 99 },
        { saved_record_index: 3, t_read_us: 4000, x_raw: 31, y_raw: 2, z_raw: 124 },
        { saved_record_index: 4, t_read_us: 6000, x_raw: 8, y_raw: -3, z_raw: 110 },
        { saved_record_index: 5, t_read_us: 8000, x_raw: 0, y_raw: 0, z_raw: 99 }
      ],
      hx: [
        { saved_record_index: 0, t_read_us: 0, hx_raw: 835210, sat: false, record_kind: "TRIAL_ACCEPTED" },
        { saved_record_index: 1, t_read_us: 15000, hx_raw: 835188, sat: false, record_kind: "TRIAL_ACCEPTED" },
        { saved_record_index: 2, t_read_us: 15000, hx_raw: 835170, sat: true, record_kind: "TRIAL_ACCEPTED" },
        { saved_record_index: 3, t_read_us: 30000, hx_raw: 835204, sat: false, record_kind: "TRIAL_ACCEPTED" },
        { saved_record_index: 4, t_read_us: 45000, hx_raw: 835196, sat: false, record_kind: "TRIAL_ACCEPTED" }
      ],
      optical: [{
        saved_record_index: 0, upper_seen: true, lower_seen: true,
        upper_us: 100, lower_us: 200, dt_us: 99, configured_distance_mm: 220,
        semantic_validation: "INVALID", reason_codes: ["DT_MISMATCH_SYNTHETIC"]
      }],
      quality: {
        quality_scope: "frozen_trial_delta", hx_errors: 1, acc_errors: 0,
        fifo_warnings: 1, reason_codes: ["SYNTHETIC_ONLY"]
      },
      speedState: "INVALID_INPUT",
      speedValue: null,
      speedSemantic: "INVALID",
      speedEligibility: "UNQUALIFIED",
      speedReasons: ["DT_MISMATCH_SYNTHETIC"]
    }),
    DEMO_RUN_SPEED_001: makeHistoryBundle({
      runId: "DEMO_RUN_SPEED_001",
      snapshot: "demo-snapshot-speed-1",
      publication: "demo-publication-speed-1",
      published: "2026-10-30T08:55:00Z",
      mode: "SPEED",
      firmware: "demo-fw-rmt2",
      profile: "demo-profile-speed-v1",
      clockId: "DEMO_CLOCK_SPEED_01",
      clockOrigin: "BOOT_MICROS",
      fixtureId: "DEMO_FIXTURE_SPEED_001",
      acc: [],
      hx: [],
      optical: [{
        saved_record_index: 0, upper_seen: true, lower_seen: true,
        upper_us: 1000000, lower_us: 2153289, dt_us: 1153289,
        configured_distance_mm: 220, semantic_validation: "VALID", reason_codes: []
      }],
      quality: {
        quality_scope: "no_ADC_records", hx_errors: null, acc_errors: null,
        fifo_warnings: null, reason_codes: ["SYNTHETIC_ONLY"]
      },
      speedState: "COMPUTED",
      speedValue: 0.190759,
      speedSemantic: "VALID",
      speedEligibility: "UNKNOWN",
      speedReasons: ["DISTANCE_UNCERTAINTY_NOT_VERIFIED"]
    })
  };

  function metric(run, id, state, semantic, eligibility, value, unit, reasons, methodRevision = null) {
    return {
      metric_id: id,
      source_public_snapshot_revision: run.snapshot,
      analysis_revision: "demo-analysis-v1",
      method_revision: methodRevision,
      qualification_revision: null,
      evidence_revision: null,
      calculation_state: state,
      semantic_validation: semantic,
      metric_eligibility: eligibility,
      physical_result: "UNKNOWN",
      value,
      unit,
      reason_codes: reasons
    };
  }

  function makeHistoryBundle(input) {
    const run = { snapshot: input.snapshot };
    const speed = metric(
      run, "TWO_GATE_AVERAGE_SPEED", input.speedState, input.speedSemantic,
      input.speedEligibility, input.speedValue, "m/s", input.speedReasons,
      input.speedState === "COMPUTED" ? "demo-two-gate-formula-v1" : null
    );
    const noAdc = input.mode === "SPEED";
    const accMetric = metric(run, "NOMINAL_SAVED_ACC_AXIS_EXTREME", "UNAVAILABLE", "UNKNOWN", noAdc ? "NOT_APPLICABLE" : "UNKNOWN", null, "counts", [noAdc ? "NO_ADC_RECORDS" : "METHOD_NOT_QUALIFIED"]);
    const hxMetric = metric(run, "NOMINAL_SAVED_HX_EXTREME", "UNAVAILABLE", "UNKNOWN", noAdc ? "NOT_APPLICABLE" : "UNKNOWN", null, "counts", [noAdc ? "NO_ADC_RECORDS" : "HX_UNCALIBRATED_RAW_ONLY"]);
    const unsupported = [
      ["CONTACT_FORCE_PEAK", "N", "NO_FORCE_SENSOR_SOURCE"],
      ["IMPULSE", "N*s", "NO_SYNCHRONIZED_FORCE_SOURCE"],
      ["LOAD_WORK", "J", "NO_VALIDATED_EVENT_WINDOW"],
      ["ENERGY_DISSIPATION", "J", "NO_ENERGY_BALANCE"],
      ["SRS", "unknown", "NO_QUALIFIED_SRS_INPUT"],
      ["MATERIAL_RANKING", "unknown", "NO_SPECIMEN_COMPARISON_EVIDENCE"]
    ].map(([id, unit, reason]) => metric(run, id, "UNAVAILABLE", "UNKNOWN", "UNQUALIFIED", null, unit, [reason]));

    return {
      schema_name: "public-history-v1",
      schema_version: 1,
      contract_revision: "synthetic-mvp-1",
      model_kind: "RUN_BUNDLE",
      environment: "demo",
      dataset_kind: "synthetic",
      provenance: { kind: "SYNTHETIC_GENERATOR", fixture_id: input.fixtureId, generator_revision: "demo-generator-v1" },
      public_run_id: input.runId,
      public_snapshot_revision: input.snapshot,
      publication_revision: input.publication,
      published_utc: input.published,
      run_mode: input.mode,
      firmware_public_revision: input.firmware,
      profile_revision: input.profile,
      storage: { state: "COMMITTED", evidence_level: "SYNTHETIC_ASSERTION" },
      clock: { public_clock_id: input.clockId, width_bits: 32, time_origin: input.clockOrigin, wrap_resolution: "NO_WRAP_IN_OBSERVED_WINDOW" },
      streams: { ACC: input.acc, HX: input.hx, OPTICAL: input.optical },
      quality: input.quality,
      analysis: [speed, accMetric, hxMetric, ...unsupported]
    };
  }

  function liveBase(session, capture, mode, fixtureId) {
    return {
      schema_name: "public-live-v1", schema_version: 1, contract_revision: "synthetic-mvp-1",
      environment: "demo", dataset_kind: "synthetic",
      provenance: { kind: "SYNTHETIC_GENERATOR", fixture_id: fixtureId, generator_revision: "demo-generator-v1" },
      public_session_id: session, public_capture_id: capture, run_mode: mode,
      firmware_public_revision: "demo-fw-rmt2", profile_revision: "demo-live-profile-v1"
    };
  }

  function observation(channel, sequence, stamp, value, semantics, age, ageBasis = "SOURCE_CLOCK", reasons = []) {
    return {
      channel,
      source_observation_seq: sequence,
      source_clock_id: "DEMO_CLOCK_LIVE_01",
      source_stamp_us: stamp,
      time_semantics: semantics,
      source_age_at_emit_us: age,
      age_basis: ageBasis,
      record_validity: value === null ? "UNKNOWN" : "VALID",
      value,
      unit: channel === "OPTICAL" ? "us" : "counts",
      quality_scope: channel === "OPTICAL" ? "SELECTED_GATE_EVENT" : "LATEST_ACCEPTED_OBSERVATION",
      reason_codes: reasons
    };
  }

  function continuity(state = "CONTIGUOUS_TELEMETRY", gaps = [], coalesced = 0) {
    return { state, gaps, coalesced_messages: coalesced };
  }

  function event(base, seq, kind, observations, received, published, flow, captureState = null) {
    const result = {
      ...base, model_kind: "EVENT", source_message_seq: String(seq), message_kind: kind,
      observations, server_received_utc: received, public_published_utc: published, continuity: flow
    };
    if (kind === "CAPTURE_STATE") result.capture_state = captureState;
    return result;
  }

  function freshness(state, basis, age, reasons = []) {
    return {
      source_freshness: state,
      freshness_basis: basis,
      source_age_estimate_us: age,
      source_age_uncertainty_us: null,
      reason_codes: reasons
    };
  }

  function latestObservation(sourceEvent, obs) {
    return {
      source_message_seq: sourceEvent.source_message_seq,
      observation: obs,
      server_received_utc: sourceEvent.server_received_utc,
      public_published_utc: sourceEvent.public_published_utc,
      freshness: freshness("UNKNOWN", "UNPROVEN", null, obs.reason_codes.length ? obs.reason_codes : ["SOURCE_AGE_UNPROVEN"])
    };
  }

  function parseDemoUtc(value) {
    if (typeof value !== "string" || !value.endsWith("Z")) return null;
    const millis = Date.parse(value);
    return Number.isFinite(millis) ? millis : null;
  }

  function deriveDemoFreshness(base, item, servedUtc, ttlPolicy) {
    const observation = item.observation;
    const unknown = (codes) => freshness("UNKNOWN", "UNPROVEN", null, codes.length ? codes : ["SOURCE_CLOCK_MAPPING_UNKNOWN"]);
    if (base.environment !== "demo" || base.dataset_kind !== "synthetic" || base.provenance?.kind !== "SYNTHETIC_GENERATOR") {
      return unknown(["SYNTHETIC_ONLY"]);
    }
    if (observation.age_basis !== "SOURCE_CLOCK" || !Number.isSafeInteger(observation.source_age_at_emit_us) ||
        observation.source_age_at_emit_us < 0 || !observation.source_clock_id) {
      return unknown(observation.reason_codes);
    }

    // The per-sensor server_received_utc is the immutable first-accept anchor.
    // Do not substitute the latest heartbeat/duplicate receipt or served_utc.
    const receivedMs = parseDemoUtc(item.server_received_utc);
    const publishedMs = parseDemoUtc(item.public_published_utc);
    const servedMs = parseDemoUtc(servedUtc);
    if (receivedMs === null || publishedMs === null || servedMs === null ||
        receivedMs > publishedMs || publishedMs > servedMs) {
      return unknown(["SOURCE_CLOCK_MAPPING_UNKNOWN"]);
    }

    const relayAgeUs = (servedMs - receivedMs) * 1000;
    const ageDemoUs = observation.source_age_at_emit_us + relayAgeUs;
    if (!Number.isSafeInteger(relayAgeUs) || !Number.isSafeInteger(ageDemoUs) || relayAgeUs < 0) {
      return unknown(["SOURCE_CLOCK_MAPPING_UNKNOWN"]);
    }

    const expired = ageDemoUs > ttlPolicy.source_ttl_us || relayAgeUs > ttlPolicy.relay_ttl_us;
    return freshness(expired ? "STALE" : "FRESH", "SOURCE_AGE_ONLY", ageDemoUs,
      expired ? ["SOURCE_TTL_EXCEEDED"] : []);
  }

  function latestModel(base, byChannel, transportEvent, served, state, flow) {
    const ttlPolicy = {
      revision: "demo-ttl-policy-v1", source_ttl_us: 2000000, relay_ttl_us: 5000000,
      unsynchronized_clock_rule: "SOURCE_AGE_ONLY_NEAR_REALTIME_UNVERIFIED_LATENCY_OR_UNKNOWN"
    };
    return {
      ...base,
      model_kind: "LATEST",
      latest_by_channel: byChannel.map((item) => ({
        ...item,
        freshness: deriveDemoFreshness(base, item, served, ttlPolicy)
      })),
      latest_transport_message: transportEvent ? {
        source_message_seq: transportEvent.source_message_seq,
        message_kind: transportEvent.message_kind,
        server_received_utc: transportEvent.server_received_utc,
        public_published_utc: transportEvent.public_published_utc
      } : null,
      served_utc: served,
      ttl_policy: ttlPolicy,
      transport_state: state,
      continuity: flow
    };
  }

  const baseLive = liveBase("DEMO_SESSION_TRIAL_01", "DEMO_CAPTURE_TRIAL_01", "TRIAL", "DEMO_FIXTURE_LIVE_001");
  const summary100 = event(baseLive, "100", "SUMMARY", [
    observation("ACC", "20", 4000, { x_raw: 3, y_raw: -4, z_raw: 99 }, "ARM_RELATIVE_READOUT_US", 2200),
    observation("HX", "31", 9000, { hx_raw: 835190, sat: false }, "ARM_RELATIVE_READOUT_US", 3500),
    observation("OPTICAL", "8", 12000, { gate: "UPPER", event_us: 12000 }, "ARM_RELATIVE_GATE_EVENT_US", 1800)
  ], "2026-10-30T09:00:00Z", "2026-10-30T09:00:01Z", continuity());
  const summary101 = event(baseLive, "101", "SUMMARY", [
    observation("ACC", "21", 6000, { x_raw: 18, y_raw: -2, z_raw: 105 }, "ARM_RELATIVE_READOUT_US", 2400),
    observation("HX", "32", 15000, { hx_raw: 835176, sat: false }, "ARM_RELATIVE_READOUT_US", 3700),
    observation("OPTICAL", "9", 18000, { gate: "LOWER", event_us: 18000 }, "ARM_RELATIVE_GATE_EVENT_US", 2100)
  ], "2026-10-30T09:00:02Z", "2026-10-30T09:00:03Z", continuity());
  const heartbeat102 = event(baseLive, "102", "HEARTBEAT", [], "2026-10-30T09:00:04Z", "2026-10-30T09:00:04Z", continuity());
  const gap104 = event(baseLive, "104", "SUMMARY", [
    observation("ACC", "22", 11000, { x_raw: -7, y_raw: 0, z_raw: 96 }, "ARM_RELATIVE_READOUT_US", 2600),
    observation("HX", "33", 26000, { hx_raw: 835181, sat: true }, "ARM_RELATIVE_READOUT_US", 4100),
    observation("OPTICAL", "10", 24000, { gate: "UPPER", event_us: 24000 }, "ARM_RELATIVE_GATE_EVENT_US", 2400)
  ], "2026-10-30T09:00:06Z", "2026-10-30T09:00:07Z", continuity("GAP", [{
    scope: "SOURCE_MESSAGES", reason: "SOURCE_COALESCED", from_seq: "103", to_seq: "103", count: 1
  }], 1));
  const heartbeat105 = event(baseLive, "105", "HEARTBEAT", [], "2026-10-30T09:00:08Z", "2026-10-30T09:00:08Z", continuity("GAP", [{
    scope: "SOURCE_MESSAGES", reason: "SOURCE_COALESCED", from_seq: "103", to_seq: "103", count: 1
  }], 1));
  const unknownAge106 = event(baseLive, "106", "SUMMARY", [
    observation("ACC", "23", 13000, { x_raw: 0, y_raw: 0, z_raw: 101 }, "ARM_RELATIVE_READOUT_US", null, "UNKNOWN", ["SOURCE_AGE_UNPROVEN"]),
    observation("HX", "34", 28000, { hx_raw: 835181, sat: false }, "ARM_RELATIVE_READOUT_US", 4300),
    observation("OPTICAL", "11", 27000, null, "UNKNOWN", null, "UNKNOWN", ["SOURCE_CLOCK_MAPPING_UNKNOWN"])
  ], "2026-10-30T09:00:10Z", "2026-10-30T09:00:11Z", continuity("UNKNOWN", [], null));

  const freshByChannel = [
    latestObservation(summary101, summary101.observations[0]),
    latestObservation(summary101, summary101.observations[1]),
    latestObservation(summary101, summary101.observations[2])
  ];
  const staleByChannel = [
    latestObservation(gap104, gap104.observations[0]),
    latestObservation(gap104, gap104.observations[1]),
    latestObservation(gap104, gap104.observations[2])
  ];
  const unknownAgeByChannel = [
    latestObservation(unknownAge106, unknownAge106.observations[0]),
    latestObservation(unknownAge106, unknownAge106.observations[1]),
    latestObservation(unknownAge106, unknownAge106.observations[2])
  ];

  const newEpochBase = liveBase("DEMO_SESSION_EPOCH_02", null, null, "DEMO_FIXTURE_EPOCH_02");
  const LIVE_SCENARIOS = {
    unknown: null,
    fresh: {
      latest: latestModel(baseLive, freshByChannel, summary101, "2026-10-30T09:00:03Z", "RECENT", continuity()),
      events: [summary100, summary101],
      label: "感測摘要｜SYNTHETIC LIVE"
    },
    heartbeat: {
      latest: latestModel(baseLive, freshByChannel, heartbeat102, "2026-10-30T09:00:04Z", "RECENT", continuity()),
      events: [summary100, summary101, heartbeat102],
      label: "Heartbeat-only｜感測資料未更新"
    },
    gap: {
      latest: latestModel(baseLive, [
        latestObservation(gap104, gap104.observations[0]),
        latestObservation(gap104, gap104.observations[1]),
        latestObservation(gap104, gap104.observations[2])
      ], gap104, "2026-10-30T09:00:07Z", "RECENT", gap104.continuity),
      events: [summary100, summary101, heartbeat102, gap104],
      label: "訊息缺口｜更新仍持續"
    },
    unknownAge: {
      latest: latestModel(baseLive, unknownAgeByChannel, unknownAge106, "2026-10-30T09:00:11Z", "RECENT", continuity("UNKNOWN", [], null)),
      events: [summary100, summary101, heartbeat102, gap104, heartbeat105, unknownAge106],
      label: "來源時效未知"
    },
    stale: {
      latest: latestModel(baseLive, staleByChannel, heartbeat105, "2026-10-30T09:00:09Z", "RECENT", heartbeat105.continuity),
      events: [summary100, summary101, heartbeat102, gap104, heartbeat105],
      label: "Sensor STALE｜通道仍有回報"
    },
    timeout: {
      latest: latestModel(baseLive, staleByChannel, heartbeat105, "2026-10-30T09:00:30Z", "TIMED_OUT", heartbeat105.continuity),
      events: [summary100, summary101, heartbeat102, gap104, heartbeat105],
      label: "公開資料通道逾時"
    },
    newEpoch: {
      latest: latestModel(newEpochBase, [], null, "2026-10-30T09:01:00Z", "UNKNOWN", continuity("UNKNOWN", [], null)),
      events: [],
      label: "新觀測時段｜尚無新樣本"
    }
  };

  const HISTORY_OPTIONS = {
    "": { state: "NO_SELECTION", title: "選擇合成歷史紀錄", body: "尚未選輪。原型不會自動挑最新或第一筆資料。", badgeClass: "status-unknown" },
    __empty: { state: "NOT_PUBLISHED", title: "尚無可檢視的合成封存紀錄", body: "這是索引為空的本機案例；不代表裝置未開始或零次實驗。", badgeClass: "status-neutral" },
    __notFound: { state: "NOT_FOUND", title: "所選合成紀錄目前不可取得", body: "已清除舊圖表、tooltip 與下載；請選另一筆合成紀錄。", badgeClass: "status-stale" },
    __error: { state: "ERROR", title: "無法載入所選合成紀錄", body: "這是本機讀取錯誤案例，不會當成空索引或零資料。", badgeClass: "status-error" },
    __version: { state: "SCHEMA_MISMATCH", title: "合成資料版本不相容", body: "原型不猜測欄位、不套用前一輪資料，也不提供下載。", badgeClass: "status-error" }
  };

  let activeHistory = null;
  let historyRequestToken = 0;
  let liveScenarioKey = "unknown";
  let playTimer = null;
  let playIndex = 0;
  let downloadUrl = null;
  let livePaused = false;
  let chartTooltip = null;
  let chartCounter = 0;

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function escapeAttr(value) { return escapeHtml(value).replace(/`/g, "&#96;"); }

  function clone(value) { return JSON.parse(JSON.stringify(value)); }

  function shortTime(value) {
    if (!value) return "UNKNOWN";
    return `${value.replace("T", " ").replace("Z", " UTC")}`;
  }

  function numericText(value) {
    return value === null || value === undefined ? "UNKNOWN" : new Intl.NumberFormat("en-US").format(value);
  }

  function codeLabel(code) { return REASON_LABELS[code] || code.replaceAll("_", " ").toLowerCase(); }

  function reasonText(codes) {
    return !codes || !codes.length ? "無合成 fixture reason code" : codes.map(codeLabel).join("；");
  }

  function setBadge(element, text, className) {
    element.textContent = text;
    element.className = `status-badge ${className}`;
  }

  function detailList(entries) {
    return entries.map(([label, value, extraClass]) =>
      `<dt>${escapeHtml(label)}</dt><dd${extraClass ? ` class="${extraClass}"` : ""}>${value}</dd>`
    ).join("");
  }

  function valueHtml(value, mono = false) {
    if (value === null || value === undefined || value === "") return `<span class="unknown-value">UNKNOWN｜未提供</span>`;
    const str = typeof value === "object" ? JSON.stringify(value) : String(value);
    return mono ? `<span class="mono">${escapeHtml(str)}</span>` : escapeHtml(str);
  }

  function formatMicroseconds(value) {
    if (value === null || value === undefined) return "UNKNOWN｜無可信來源 age";
    if (value >= 1000000) return `${(value / 1000000).toFixed(2)} s`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)} ms`;
    return `${numericText(value)} us`;
  }

  function freshnessBadge(freshness) {
    const state = freshness && freshness.source_freshness;
    if (state === "FRESH") return ["SYNTHETIC FRESH", "status-recent"];
    if (state === "STALE") return ["STALE｜來源 age 超門檻", "status-stale"];
    if (state === "NOT_APPLICABLE") return ["NOT APPLICABLE", "status-neutral"];
    return ["UNKNOWN｜無可信 age", "status-unknown"];
  }

  function updateLiveBadge(latest) {
    const badge = $("liveTransportBadge");
    if (!latest) {
      setBadge(badge, "UNKNOWN · 尚無可信觀測", "status-unknown");
      return;
    }
    if (latest.transport_state === "TIMED_OUT") setBadge(badge, "TIMED_OUT · 公開資料通道逾時", "status-stale");
    else if (latest.transport_state === "UNKNOWN") setBadge(badge, "UNKNOWN · 尚無可信觀測", "status-unknown");
    else setBadge(badge, "通道有新回報 · 感測時效見各卡", "status-recent");
  }

  function freshnessReason(item) {
    const fresh = item.freshness;
    if (fresh.source_freshness === "FRESH" || fresh.source_freshness === "STALE") {
      const basis = fresh.freshness_basis === "SOURCE_AGE_ONLY" ? "來源 age-only；非精準單向延遲" : fresh.freshness_basis;
      return `${formatMicroseconds(fresh.source_age_estimate_us)} · ${basis}`;
    }
    return reasonText(fresh.reason_codes.length ? fresh.reason_codes : item.observation.reason_codes);
  }

  function renderLiveIdentity(latest) {
    if (!latest) {
      $("liveIdentity").innerHTML = detailList([
        ["Session", "尚未建立", "unknown-value"],
        ["Capture", "UNKNOWN", "unknown-value"],
        ["Mode", "UNKNOWN", "unknown-value"],
        ["Firmware / profile", "UNKNOWN", "unknown-value"]
      ]);
      return;
    }
    $("liveIdentity").innerHTML = detailList([
      ["Public session", valueHtml(latest.public_session_id, true)],
      ["Public capture", valueHtml(latest.public_capture_id, true)],
      ["Run mode", valueHtml(latest.run_mode)],
      ["Firmware revision", valueHtml(latest.firmware_public_revision, true)],
      ["Profile revision", valueHtml(latest.profile_revision, true)],
      ["Dataset", `<span class="synthetic-inline">${escapeHtml(latest.dataset_kind.toUpperCase())}</span>`]
    ]);
  }

  function renderTransport(latest) {
    const continuityBadge = $("liveContinuityBadge");
    const gapNotice = $("gapNotice");
    if (!latest) {
      setBadge(continuityBadge, "UNKNOWN · 未提供", "status-neutral");
      $("liveTransportDetails").innerHTML = detailList([
        ["來源訊息序號", "UNKNOWN", "unknown-value"],
        ["訊息類型", "UNKNOWN", "unknown-value"],
        ["伺服器收件時間", "UNKNOWN", "unknown-value"],
        ["API served_utc", "UNKNOWN", "unknown-value"]
      ]);
      gapNotice.hidden = true;
      return;
    }
    const transport = latest.latest_transport_message;
    const flow = latest.continuity;
    const flowClass = flow.state === "GAP" ? "status-stale" : flow.state === "CONTIGUOUS_TELEMETRY" ? "status-recent" : "status-neutral";
    setBadge(continuityBadge, flow.state, flowClass);
    $("liveTransportDetails").innerHTML = detailList([
      ["Transport state", escapeHtml(latest.transport_state)],
      ["來源訊息序號", transport ? `<span class="mono">${escapeHtml(transport.source_message_seq)}</span> <span class="small-note">（非 ADC 序號）</span>` : "UNKNOWN", transport ? "" : "unknown-value"],
      ["訊息類型", transport ? escapeHtml(transport.message_kind) : "UNKNOWN", transport ? "" : "unknown-value"],
      ["伺服器收件時間", transport ? escapeHtml(shortTime(transport.server_received_utc)) : "UNKNOWN", transport ? "" : "unknown-value"],
      ["公開發布時間", transport ? escapeHtml(shortTime(transport.public_published_utc)) : "UNKNOWN", transport ? "" : "unknown-value"],
      ["Latest served_utc", escapeHtml(shortTime(latest.served_utc))]
    ]);
    if (flow.state === "GAP" && flow.gaps.length) {
      const descriptions = flow.gaps.map((gap) => {
        const scope = gap.scope === "SOURCE_MESSAGES" ? "來源訊息" : gap.scope === "RELAY_MESSAGES" ? "relay 訊息" : "檢視窗口";
        const range = gap.from_seq === null ? "範圍未知" : `${gap.from_seq}–${gap.to_seq}`;
        const count = gap.count === null ? "數量未知" : `${gap.count} 則訊息`;
        return `${scope} ${range} · ${count} · ${escapeHtml(codeLabel(gap.reason))}`;
      });
      gapNotice.innerHTML = `<strong>有訊息缺口</strong> ${descriptions.join("；")}。不推論 ADC 漏樣數。`;
      gapNotice.hidden = false;
    } else {
      gapNotice.hidden = true;
      gapNotice.textContent = "";
    }
  }

  function sensorValue(observation) {
    if (!observation || observation.value === null) return { value: "UNKNOWN", unit: "無資料", lines: [] };
    const value = observation.value;
    if (observation.channel === "ACC") {
      return {
        value: `X ${numericText(value.x_raw)} · Y ${numericText(value.y_raw)} · Z ${numericText(value.z_raw)}`,
        unit: "RAW counts",
        lines: [["X / Y / Z", `${numericText(value.x_raw)} / ${numericText(value.y_raw)} / ${numericText(value.z_raw)} counts`]]
      };
    }
    if (observation.channel === "HX") {
      return { value: numericText(value.hx_raw), unit: "RAW counts", lines: [["SAT", value.sat ? "true · 飽和旗標" : "false"]] };
    }
    return { value: `${value.gate} · ${numericText(value.event_us)}`, unit: "閘事件 us", lines: [["Gate event", `${value.gate} at ${numericText(value.event_us)} us`]] };
  }

  function renderSensors(latest) {
    const root = $("liveSensors");
    if (!latest) {
      root.innerHTML = `<article class="sensor-card sensor-placeholder"><span class="sensor-icon" aria-hidden="true">?</span><div><h4>尚無可信觀測</h4><p>開始本機合成示範後，這裡會顯示來源提供的狀態。</p></div><span class="mini-tag synthetic-tag">SYNTHETIC</span></article>`;
      return;
    }
    const channels = ["ACC", "HX", "OPTICAL"];
    const sensorMap = new Map(latest.latest_by_channel.map((item) => [item.observation.channel, item]));
    root.innerHTML = channels.map((channel) => {
      const item = sensorMap.get(channel);
      const title = channel === "ACC" ? "Accelerometer" : channel === "HX" ? "Load cell interface" : "Optical gate";
      const icon = channel === "OPTICAL" ? "OPT" : channel;
      if (!item && latest.run_mode === "SPEED" && channel !== "OPTICAL") {
        return `<article class="sensor-card sensor-unknown"><div class="sensor-head"><span class="sensor-icon" aria-hidden="true">${icon}</span><div><h4>${channel} · ${title}</h4><p>SPEED mode</p></div><span class="mini-tag synthetic-tag">SYNTHETIC</span></div><div class="sensor-values"><strong>NOT APPLICABLE</strong></div><div class="sensor-meta"><span>模式狀態 <strong>此模式未記錄</strong></span><span>非零警示 <strong>不推定</strong></span></div></article>`;
      }
      if (!item) {
        return `<article class="sensor-card sensor-unknown"><div class="sensor-head"><span class="sensor-icon" aria-hidden="true">${icon}</span><div><h4>${channel} · ${title}</h4><p>SYNTHETIC observation</p></div><span class="mini-tag synthetic-tag">SYNTHETIC</span></div><div class="sensor-values"><strong>UNKNOWN</strong><span>未提供</span></div><div class="sensor-meta"><span>Freshness <strong>UNKNOWN</strong></span><span>Reason <strong>無此 channel 的最新觀測</strong></span></div></article>`;
      }
      const obs = item.observation;
      const [freshLabel, freshClass] = freshnessBadge(item.freshness);
      const val = sensorValue(obs);
      const stateClass = item.freshness.source_freshness === "STALE" ? "sensor-stale" : item.freshness.source_freshness === "UNKNOWN" ? "sensor-unknown" : "";
      const sourceStamp = obs.source_stamp_us === null ? "UNKNOWN" : `${numericText(obs.source_stamp_us)} us · ${obs.time_semantics}`;
      const ageAtEmit = obs.source_age_at_emit_us === null ? reasonText(obs.reason_codes) : formatMicroseconds(obs.source_age_at_emit_us);
      const ageNow = freshnessReason(item);
      const seq = item.source_message_seq;
      const calibrationLine = channel === "ACC" || channel === "HX" ? `<span>校正資格 <strong>UNKNOWN · live schema 未提供校正狀態</strong></span>` : "";
      return `<article class="sensor-card ${stateClass}">
        <div class="sensor-head"><span class="sensor-icon" aria-hidden="true">${icon}</span><div><h4>${channel} · ${title}</h4><p>Observation seq ${escapeHtml(obs.source_observation_seq ?? "UNKNOWN")} · 非 ADC 序號</p></div><span class="mini-tag synthetic-tag">SYNTHETIC</span></div>
        <div class="sensor-values"><strong>${escapeHtml(val.value)}</strong><span>${escapeHtml(val.unit)}</span></div>
        <div class="sensor-meta">
          <span>來源時效 <strong>${escapeHtml(freshLabel)}</strong></span>
          <span>來源 age estimate <strong>${escapeHtml(ageNow)}</strong></span>
          <span>來源 age at emit <strong>${escapeHtml(ageAtEmit)}</strong></span>
          <span>Source message seq <strong>${escapeHtml(seq)} · 非 ADC 序號</strong></span>
          <span>來源時刻 <strong>${escapeHtml(sourceStamp)}</strong></span>
          <span>Record validity <strong>${escapeHtml(obs.record_validity)}</strong></span>
          ${calibrationLine}
          ${val.lines.map(([label, value]) => `<span>${escapeHtml(label)} <strong>${escapeHtml(value)}</strong></span>`).join("")}
          ${item.freshness.reason_codes.length ? `<span>Reason <strong>${escapeHtml(reasonText(item.freshness.reason_codes))}</strong></span>` : ""}
        </div>
      </article>`;
    }).join("");
  }

  function addTooltipLayer() {
    if (chartTooltip) return;
    chartTooltip = document.createElement("div");
    chartTooltip.className = "chart-tooltip";
    chartTooltip.hidden = true;
    chartTooltip.setAttribute("role", "tooltip");
    document.body.appendChild(chartTooltip);
    document.addEventListener("pointerover", (event) => {
      const point = event.target.closest(".chart-point");
      if (point) showPointTooltip(point, event.clientX, event.clientY);
    });
    document.addEventListener("pointermove", (event) => {
      if (!chartTooltip.hidden && event.pointerType !== "touch") moveTooltip(event.clientX, event.clientY);
    });
    document.addEventListener("pointerout", (event) => {
      const point = event.target.closest(".chart-point");
      if (point) hideTooltip(point.getAttribute("data-tooltip-scope"));
    });
    document.addEventListener("focusin", (event) => {
      const point = event.target.closest(".chart-point");
      if (point) {
        const rect = point.getBoundingClientRect();
        showPointTooltip(point, rect.left + rect.width / 2, rect.top);
      }
    });
    document.addEventListener("focusout", (event) => {
      const point = event.target.closest(".chart-point");
      if (point) hideTooltip(point.getAttribute("data-tooltip-scope"));
    });
  }

  function showPointTooltip(point, x, y) {
    if (!chartTooltip) addTooltipLayer();
    chartTooltip.dataset.scope = point.getAttribute("data-tooltip-scope") || "unknown";
    const identity = point.getAttribute("data-tooltip-identity");
    chartTooltip.textContent = `${SYNTHETIC_NOTICE}${identity ? ` ${identity} ·` : ""} ${point.getAttribute("data-tooltip") || point.getAttribute("aria-label") || ""}`;
    chartTooltip.hidden = false;
    moveTooltip(x, y);
  }

  function moveTooltip(x, y) {
    const margin = 12;
    const rect = chartTooltip.getBoundingClientRect();
    let left = x + 14;
    let top = y + 14;
    if (left + rect.width > window.innerWidth - margin) left = Math.max(margin, x - rect.width - 14);
    if (top + rect.height > window.innerHeight - margin) top = Math.max(margin, y - rect.height - 14);
    chartTooltip.style.left = `${left}px`;
    chartTooltip.style.top = `${top}px`;
  }

  function hideTooltip(scope) {
    if (!chartTooltip || chartTooltip.hidden) return;
    if (scope && chartTooltip.dataset.scope !== scope) return;
    chartTooltip.hidden = true;
    chartTooltip.dataset.scope = "";
  }

  function renderSvgChart(container, seriesList, opts) {
    hideTooltip(opts.tooltipScope);
    const points = seriesList.flatMap((series) => series.points || []);
    if (!points.length) {
      container.classList.add("empty-chart");
      container.textContent = opts.emptyMessage || "沒有可繪製的合成資料。";
      return;
    }
    container.classList.remove("empty-chart");
    const width = 720, height = 270, left = 66, right = 22, top = 25, bottom = 54;
    let xMin = Math.min(...points.map((p) => p.x));
    let xMax = Math.max(...points.map((p) => p.x));
    let yMin = Math.min(...points.map((p) => p.y));
    let yMax = Math.max(...points.map((p) => p.y));
    if (xMin === xMax) { xMin -= 1; xMax += 1; }
    if (yMin === yMax) { yMin -= 1; yMax += 1; }
    const yPad = Math.max(1, (yMax - yMin) * 0.12);
    yMin -= yPad; yMax += yPad;
    const x = (value) => left + ((value - xMin) / (xMax - xMin)) * (width - left - right);
    const y = (value) => height - bottom - ((value - yMin) / (yMax - yMin)) * (height - top - bottom);
    const tickRows = 4;
    const grid = Array.from({ length: tickRows + 1 }, (_, index) => {
      const fraction = index / tickRows;
      const yy = top + fraction * (height - top - bottom);
      const value = yMax - fraction * (yMax - yMin);
      return `<line class="chart-grid-line" x1="${left}" y1="${yy}" x2="${width - right}" y2="${yy}"/><text class="chart-tick" x="${left - 8}" y="${yy + 4}" text-anchor="end">${escapeHtml(formatTick(value))}</text>`;
    }).join("");
    const xTicks = [xMin, (xMin + xMax) / 2, xMax].map((value) => {
      const xx = x(value);
      return `<line class="chart-grid-line" x1="${xx}" y1="${top}" x2="${xx}" y2="${height - bottom}"/><text class="chart-tick" x="${xx}" y="${height - bottom + 18}" text-anchor="middle">${escapeHtml(formatTick(value))}</text>`;
    }).join("");
    const seriesMarkup = seriesList.map((series) => {
      const segments = [];
      let current = [];
      series.points.forEach((point) => {
        if (point.breakBefore && current.length) { segments.push(current); current = []; }
        current.push(point);
      });
      if (current.length) segments.push(current);
      const paths = segments.filter((segment) => segment.length > 1).map((segment) => {
        const d = segment.map((p, index) => `${index === 0 ? "M" : "L"} ${x(p.x).toFixed(2)} ${y(p.y).toFixed(2)}`).join(" ");
        return `<path class="chart-series-path" d="${d}" stroke="${series.color}"/>`;
      }).join("");
      const circles = series.points.map((p) => {
        const label = p.tooltip || `${series.name}: x=${p.x}, y=${p.y}`;
        const identity = p.identity || opts.tooltipIdentity || "";
        const scope = opts.tooltipScope || "unknown";
        const tooltipText = `${SYNTHETIC_NOTICE}${identity ? ` ${identity} ·` : ""} ${label}`;
        return `<circle class="chart-point" cx="${x(p.x).toFixed(2)}" cy="${y(p.y).toFixed(2)}" r="4.3" fill="${series.color}" tabindex="0" role="img" aria-label="${escapeAttr(tooltipText)}" data-tooltip-scope="${escapeAttr(scope)}" data-tooltip-identity="${escapeAttr(identity)}" data-tooltip="${escapeAttr(label)}"><title>${escapeHtml(tooltipText)}</title></circle>`;
      }).join("");
      return `${paths}${circles}`;
    }).join("");
    const titleId = `chart-title-${++chartCounter}`;
    const legend = seriesList.map((series) => `<span class="legend-item"><i class="legend-swatch" style="background:${series.color}" aria-hidden="true"></i>${escapeHtml(series.name)} · SYNTHETIC</span>`).join("");
    container.innerHTML = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="${titleId}"><title id="${titleId}">${escapeHtml(opts.title)} · SYNTHETIC</title><desc>${escapeHtml(opts.description || "合成圖表；請使用下方資料表核對數值。")}</desc>${grid}${xTicks}<line class="chart-axis" x1="${left}" y1="${top}" x2="${left}" y2="${height - bottom}"/><line class="chart-axis" x1="${left}" y1="${height - bottom}" x2="${width - right}" y2="${height - bottom}"/>${seriesMarkup}<text class="chart-axis-label" x="${(left + width - right) / 2}" y="${height - 10}" text-anchor="middle">${escapeHtml(opts.xLabel)}</text><text class="chart-axis-label" transform="translate(17 ${(height + top - bottom) / 2}) rotate(-90)" text-anchor="middle">${escapeHtml(opts.yLabel)}</text></svg><div class="chart-legend" aria-label="SYNTHETIC 圖例">${legend}</div>`;
    addTooltipLayer();
  }

  function formatTick(value) {
    if (!Number.isFinite(value)) return "UNKNOWN";
    return new Intl.NumberFormat("en-US", { maximumFractionDigits: Math.abs(value) < 1 ? 2 : 0 }).format(value);
  }

  function buildLiveTrend(events) {
    const points = [];
    const seenObservationSeq = new Set();
    let lastClock = null;
    events.forEach((item) => {
      if (item.message_kind !== "SUMMARY") return;
      const obs = item.observations.find((row) => row.channel === "ACC");
      if (!obs || obs.record_validity !== "VALID" || !obs.value || obs.source_stamp_us === null) return;
      const key = obs.source_observation_seq;
      if (key !== null && seenObservationSeq.has(key)) return;
      if (key !== null) seenObservationSeq.add(key);
      const clockChanged = lastClock !== null && obs.source_clock_id !== lastClock;
      const hasGap = item.continuity.state === "GAP";
      points.push({
        x: obs.source_stamp_us,
        y: obs.value.x_raw,
        breakBefore: hasGap || clockChanged,
        identity: `LIVE · public_session_id=${item.public_session_id} · public_capture_id=${item.public_capture_id ?? "UNKNOWN"} · channel=ACC · source_message_seq=${item.source_message_seq} · source_observation_seq=${obs.source_observation_seq ?? "UNKNOWN"}（皆非 ADC 序號）· public_published_utc=${item.public_published_utc}`,
        tooltip: `ACC X raw counts=${obs.value.x_raw} · source_stamp_us=${obs.source_stamp_us} (${obs.time_semantics}) · server_received_utc=${item.server_received_utc}${hasGap ? " · 訊息窗口 GAP，不表示 ADC 漏樣" : ""}`
      });
      lastClock = obs.source_clock_id;
    });
    return points;
  }

  function renderLiveEventRows(events) {
    const body = $("liveEventRows");
    const recent = events.slice(-7).reverse();
    if (!recent.length) {
      body.innerHTML = `<tr><td colspan="4" class="empty-cell">尚無合成事件</td></tr>`;
      return;
    }
    body.innerHTML = recent.map((item) => `<tr>
      <td><span class="synthetic-inline">SYNTHETIC</span><br><span class="mono">${escapeHtml(item.source_message_seq)}</span><br><small>非 ADC 序號</small></td>
      <td>${escapeHtml(item.message_kind)}</td>
      <td>${escapeHtml(shortTime(item.server_received_utc))}</td>
      <td>${escapeHtml(item.continuity.state)}${item.continuity.state === "GAP" ? " · 訊息缺口" : ""}</td>
    </tr>`).join("");
  }

  function renderLiveTrend(events, latest) {
    const points = buildLiveTrend(events);
    if (!points.length) {
      const message = latest && latest.run_mode === "SPEED" ? "SPEED mode：ACC 未記錄，不畫 0 或假趨勢。" : "尚無可繪製的合成摘要。";
      renderSvgChart($("liveTrend"), [{ name: "ACC X raw counts", color: "#2866d8", points: [] }], { title: "SYNTHETIC live trend", tooltipScope: "live", emptyMessage: message });
      return;
    }
    const firstObs = events.flatMap((eventItem) => eventItem.observations).find((row) => row.channel === "ACC");
    const xLabel = firstObs ? firstObs.time_semantics.replaceAll("_", " ") : "source clock (us)";
    renderSvgChart($("liveTrend"), [{ name: "ACC X raw counts", color: "#2866d8", points }], {
      title: "SYNTHETIC live ACC X trend",
      description: "稀疏的合成摘要趨勢，不是完整 ADC waveform；訊息序號不是 ADC sample 序號。",
      xLabel, yLabel: "ACC X · raw counts", tooltipScope: "live"
    });
  }

  function updateDemoClockNotice(isPlaying) {
    const notice = $("demoClockNotice");
    if (!notice) return;
    const frame = LIVE_SCENARIOS[liveScenarioKey];
    const servedUtc = frame && frame.latest ? frame.latest.served_utc : null;
    const asOf = servedUtc
      ? shortTime(servedUtc)
      : "UNKNOWN（目前情境未提供 fixture served_utc；感測時效為 UNKNOWN）";
    notice.textContent = isPlaying
      ? `合成事件時鐘播放中（依本機合成情境推進）；時效評估截至目前 fixture served_utc：${asOf}。不以瀏覽器時間延伸感測 age。`
      : `合成事件時鐘已凍結；時效僅截至 fixture served_utc：${asOf}。不以瀏覽器時間延伸感測 age。`;
  }

  function renderLive(key, announce = true) {
    liveScenarioKey = key;
    $("liveScenario").value = key;
    const frame = LIVE_SCENARIOS[key];
    const latest = frame ? frame.latest : null;
    updateLiveBadge(latest);
    renderLiveIdentity(latest);
    renderTransport(latest);
    renderSensors(latest);
    renderLiveEventRows(frame ? frame.events : []);
    renderLiveTrend(frame ? frame.events : [], latest);
    updateDemoClockNotice(Boolean(playTimer));
    if (announce) {
      const announcement = key === "unknown" ? "即時合成情境：尚無可信觀測。" : `已切換到本機合成情境：${frame.label}。`;
      $("liveAnnouncement").textContent = announcement;
    }
  }

  function stopPlayback() {
    if (playTimer) window.clearInterval(playTimer);
    playTimer = null;
    $("playDemo").textContent = "播放合成事件";
    $("stopDemo").disabled = true;
    updateDemoClockNotice(false);
  }

  function startPlayback() {
    if (playTimer) {
      stopPlayback();
      return;
    }
    const sequence = ["fresh", "heartbeat", "gap", "unknownAge", "stale", "timeout", "newEpoch"];
    if (liveScenarioKey === "unknown") playIndex = 0;
    else {
      const current = sequence.indexOf(liveScenarioKey);
      playIndex = current >= 0 ? (current + 1) % sequence.length : 0;
    }
    $("playDemo").textContent = "暫停合成事件";
    $("stopDemo").disabled = false;
    const delay = Number($("demoSpeed").value) || 2200;
    playTimer = window.setInterval(() => {
      playIndex += 1;
      if (playIndex >= sequence.length) {
        stopPlayback();
        return;
      }
      renderLive(sequence[playIndex], false);
    }, delay);
    renderLive(sequence[playIndex]);
  }

  function setHistoryStatus(state, text, badgeClass) {
    setBadge($("historyStateBadge"), state, badgeClass);
    $("historyStateText").textContent = text;
  }

  function setHistoryEmpty(title, body, badgeText, badgeClass, requestLabel) {
    $("historyContent").hidden = true;
    $("historyEmptyState").hidden = false;
    $("historyEmptyState").querySelector("h3").textContent = title;
    $("historyEmptyState").querySelector("p").textContent = body;
    $("historyEmptyState").querySelector(".mini-tag").textContent = "SYNTHETIC";
    $("requestedRun").textContent = requestLabel || "尚未選擇";
    $("displayedRun").textContent = "未顯示";
    setHistoryStatus(badgeText, body, badgeClass);
    $("downloadHistory").disabled = true;
    $("downloadStatus").textContent = "目前狀態沒有可下載的合成 bundle。";
    activeHistory = null;
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      downloadUrl = null;
    }
    hideTooltip("history");
    clearHistoryVisuals();
  }

  function clearHistoryVisuals() {
    $("analysisMetrics").innerHTML = "";
    $("historyIdentity").innerHTML = "";
    $("historyStorage").innerHTML = "";
    $("historyQuality").innerHTML = "";
    $("historyProvenance").innerHTML = "";
    $("accRows").innerHTML = "";
    $("hxRows").innerHTML = "";
    $("opticalValues").innerHTML = "";
    $("accChart").textContent = "";
    $("hxChart").textContent = "";
    $("opticalSummary").textContent = "";
  }

  function validateDemoBundle(bundle) {
    return !!bundle && bundle.schema_name === "public-history-v1" && bundle.schema_version === 1 &&
      bundle.contract_revision === "synthetic-mvp-1" && bundle.environment === "demo" &&
      bundle.dataset_kind === "synthetic" && bundle.model_kind === "RUN_BUNDLE" &&
      bundle.provenance && bundle.provenance.kind === "SYNTHETIC_GENERATOR" &&
      bundle.public_run_id.startsWith("DEMO_RUN_");
  }

  function requestHistory(selection) {
    const token = ++historyRequestToken;
    const currentBundle = historyBundles[selection];
    const requested = currentBundle ? currentBundle.public_run_id : (selection === "__notFound" ? "DEMO_RUN_MISSING" : selection === "__error" ? "DEMO_RUN_ERROR_CASE" : selection === "__version" ? "DEMO_RUN_SCHEMA_CASE" : "");
    if (!selection) {
      setHistoryEmpty("選擇合成歷史紀錄", "尚未選輪。原型不會自動挑最新或第一筆資料。", "NO_SELECTION", "status-unknown", "尚未選擇");
      return;
    }
    $("historyContent").hidden = true;
    $("historyEmptyState").hidden = false;
    $("historyEmptyState").querySelector("h3").textContent = "載入所選合成版本…";
    $("historyEmptyState").querySelector("p").textContent = "PENDING · 本機 fixture 載入中；舊 run 圖表、tooltip 與下載已清除。";
    $("requestedRun").textContent = requested || "索引為空";
    $("displayedRun").textContent = "未顯示";
    setHistoryStatus("PENDING", "載入所選合成 fixture。", "status-stale");
    $("downloadHistory").disabled = true;
    $("downloadStatus").textContent = "PENDING：下載已停用。";
    activeHistory = null;
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      downloadUrl = null;
    }
    hideTooltip("history");
    clearHistoryVisuals();

    window.setTimeout(() => {
      if (token !== historyRequestToken) return;
      if (HISTORY_OPTIONS[selection]) {
        const state = HISTORY_OPTIONS[selection];
        setHistoryEmpty(state.title, state.body, state.state, state.badgeClass, requested || "索引為空");
        return;
      }
      const bundle = historyBundles[selection];
      if (!bundle) {
        setHistoryEmpty("所選合成紀錄目前不可取得", "NOT_FOUND · 不自動選擇其他紀錄，也不保留舊資料。", "NOT_FOUND", "status-stale", requested);
        return;
      }
      if (!validateDemoBundle(bundle)) {
        setHistoryEmpty("合成資料版本不相容", "SCHEMA_MISMATCH · 不猜欄位、不套前一輪資料。", "SCHEMA_MISMATCH", "status-error", requested);
        return;
      }
      renderHistory(bundle);
    }, 170);
  }

  function renderHistory(bundle) {
    activeHistory = bundle;
    $("historyEmptyState").hidden = true;
    $("historyContent").hidden = false;
    $("requestedRun").textContent = bundle.public_run_id;
    $("displayedRun").textContent = bundle.public_run_id;
    setHistoryStatus("READY · SYNTHETIC", "已載入本機合成封存示範；非 Google receipt。", "status-synthetic");
    $("storageBadge").textContent = "SYNTHETIC ASSERTION";
    $("storageBadge").className = "status-badge status-synthetic";
    $("qualityBadge").textContent = bundle.quality.quality_scope;
    $("qualityBadge").className = "status-badge status-neutral";
    $("historyIdentity").innerHTML = detailList([
      ["public_run_id", valueHtml(bundle.public_run_id, true)],
      ["Mode", escapeHtml(bundle.run_mode)],
      ["Snapshot revision", valueHtml(bundle.public_snapshot_revision, true)],
      ["Publication revision", valueHtml(bundle.publication_revision, true)],
      ["Firmware / profile", `${valueHtml(bundle.firmware_public_revision, true)}<br>${valueHtml(bundle.profile_revision, true)}`],
      ["Public clock", valueHtml(bundle.clock.public_clock_id, true)],
      ["Clock origin / width", `${escapeHtml(bundle.clock.time_origin)} · u${bundle.clock.width_bits}`]
    ]);
    $("historyStorage").innerHTML = detailList([
      ["Storage state", `<span class="status-inline-synthetic">${escapeHtml(bundle.storage.state)} · 合成 assertion</span>`],
      ["Evidence level", escapeHtml(bundle.storage.evidence_level)],
      ["Published UTC", escapeHtml(shortTime(bundle.published_utc))],
      ["Publication revision", valueHtml(bundle.publication_revision, true)],
      ["Measurement eligibility", "UNKNOWN · 未由保存狀態推定"],
      ["Physical result", "UNKNOWN · 未提供實測結果"]
    ]);
    $("historyQuality").innerHTML = detailList([
      ["Quality scope", escapeHtml(bundle.quality.quality_scope)],
      ["HX errors", valueHtml(bundle.quality.hx_errors)],
      ["ACC errors", valueHtml(bundle.quality.acc_errors)],
      ["FIFO warnings", valueHtml(bundle.quality.fifo_warnings)],
      ["Reason codes", escapeHtml(reasonText(bundle.quality.reason_codes))],
      ["Clock wrap", escapeHtml(bundle.clock.wrap_resolution)]
    ]);
    renderMetrics(bundle);
    renderHistoryCharts(bundle);
    renderOptical(bundle);
    $("historyProvenance").innerHTML = detailList([
      ["Schema", `${escapeHtml(bundle.schema_name)} v${bundle.schema_version}`],
      ["Contract revision", valueHtml(bundle.contract_revision, true)],
      ["Environment / dataset", `<span class="synthetic-inline">${escapeHtml(bundle.environment.toUpperCase())} · ${escapeHtml(bundle.dataset_kind.toUpperCase())}</span>`],
      ["Fixture id", valueHtml(bundle.provenance.fixture_id, true)],
      ["Generator revision", valueHtml(bundle.provenance.generator_revision, true)],
      ["Analysis revision", escapeHtml(bundle.analysis[0].analysis_revision)]
    ]);
    $("downloadHistory").disabled = false;
    $("downloadStatus").textContent = "可下載目前顯示的 synthetic public projection。";
    hideTooltip("history");
  }

  const METRIC_LABELS = {
    TWO_GATE_AVERAGE_SPEED: "兩閘區間平均速度",
    NOMINAL_SAVED_ACC_AXIS_EXTREME: "保存 ACC 軸向極值（counts）",
    NOMINAL_SAVED_HX_EXTREME: "保存 HX 極值（counts）",
    CONTACT_FORCE_PEAK: "接觸力峰值",
    IMPULSE: "衝量",
    LOAD_WORK: "力－位移功",
    ENERGY_DISSIPATION: "能量耗散",
    SRS: "SRS",
    MATERIAL_RANKING: "材料排序"
  };

  function opticalSpeedGate(bundle, record, item) {
    if (!record || !item) return { allowed: false, reason: "沒有 Optical record 或上游 metric。" };
    if (record.semantic_validation !== "VALID") {
      return { allowed: false, reason: `來源語義 ${record.semantic_validation}；${reasonText(record.reason_codes)}。` };
    }
    if (bundle.run_mode !== "SPEED" || bundle.clock.time_origin !== "BOOT_MICROS") {
      return { allowed: false, reason: "模式或時鐘來源不符合 SPEED fixture。" };
    }
    const u32 = (value) => Number.isInteger(value) && value >= 0 && value <= 0xffffffff;
    if (record.upper_seen !== true || record.lower_seen !== true || !u32(record.upper_us) || !u32(record.lower_us) ||
        !Number.isInteger(record.dt_us) || record.dt_us <= 0 || record.dt_us > 0xffffffff ||
        !Number.isFinite(record.configured_distance_mm) || record.configured_distance_mm <= 0) {
      return { allowed: false, reason: "兩閘事件、正 dt 與正設定距離條件未齊。" };
    }
    const wrappedDelta = (record.lower_us - record.upper_us + 0x100000000) % 0x100000000;
    if (wrappedDelta <= 0 || wrappedDelta !== record.dt_us || record.semantic_validation !== "VALID" || record.reason_codes.length) {
      return { allowed: false, reason: "來源 dt／語義檢核不一致。" };
    }
    if (item.metric_id !== "TWO_GATE_AVERAGE_SPEED" || item.source_public_snapshot_revision !== bundle.public_snapshot_revision ||
        item.calculation_state !== "COMPUTED" || item.semantic_validation !== "VALID" ||
        typeof item.method_revision !== "string" || !item.method_revision || item.unit !== "m/s" ||
        !Number.isFinite(item.value) || item.value <= 0) {
      return { allowed: false, reason: "上游 metric 未通過版本、方法、單位與計算欄位檢核。" };
    }
    return { allowed: true, reason: "上游 fixture 通過結構與語義門控；資格仍須獨立查看。" };
  }

  function renderMetrics(bundle) {
    $("analysisMetrics").innerHTML = bundle.analysis.map((item) => {
      const opticalRecord = bundle.streams.OPTICAL[0];
      const speedGate = item.metric_id === "TWO_GATE_AVERAGE_SPEED" ? opticalSpeedGate(bundle, opticalRecord, item) : { allowed: true };
      const computed = item.calculation_state === "COMPUTED" && item.semantic_validation === "VALID" &&
        item.source_public_snapshot_revision === bundle.public_snapshot_revision && item.method_revision &&
        Number.isFinite(item.value) && speedGate.allowed;
      const value = computed ? `${numericText(item.value)} ${item.unit}` : "UNAVAILABLE";
      const displayReasons = !speedGate.allowed
        ? speedGate.reason
        : item.reason_codes.length ? reasonText(item.reason_codes) : "合成 fixture 未附原因碼";
      return `<article class="metric-card ${computed ? "metric-computed" : ""}">
        <span class="mini-tag synthetic-tag">SYNTHETIC</span>
        <h4>${escapeHtml(METRIC_LABELS[item.metric_id] || item.metric_id)}</h4>
        <strong class="metric-value">${escapeHtml(value)}</strong>
        <span class="metric-meta">Calculation: ${escapeHtml(item.calculation_state)} · Semantic: ${escapeHtml(item.semantic_validation)}</span>
        <span class="metric-meta">Eligibility: ${escapeHtml(item.metric_eligibility)} · Physical result: ${escapeHtml(item.physical_result)}</span>
        <span class="metric-reason">Reason: ${escapeHtml(displayReasons)}</span>
      </article>`;
    }).join("");
  }

  function previousIndexBreak(records, index) {
    if (index === 0) return false;
    return records[index].saved_record_index !== records[index - 1].saved_record_index + 1;
  }

  function renderHistoryCharts(bundle) {
    const acc = bundle.streams.ACC;
    const hx = bundle.streams.HX;
    const xLabel = bundle.clock.time_origin === "ARM_RELATIVE" ? "ARM-relative readout time (us)" : "boot micros readout time (u32)";
    $("accAxisCaption").textContent = bundle.run_mode === "SPEED"
      ? "不適用：SPEED 模式未記錄 ACC；沒有假 0 圖。"
      : `橫軸 ${xLabel}；縱軸 sensor-axis RAW counts。軸方向未證明，不稱撞擊軸。`;
    $("hxAxisCaption").textContent = bundle.run_mode === "SPEED"
      ? "不適用：SPEED 模式未記錄 HX；沒有假 0 圖。"
      : `橫軸 ${xLabel}；縱軸 HX RAW counts。未校正，不顯示克或牛頓。`;
    const wrapResolved = bundle.clock.wrap_resolution === "NO_WRAP_IN_OBSERVED_WINDOW";
    const tooltipIdentity = `HISTORY · public_run_id=${bundle.public_run_id} · public_snapshot_revision=${bundle.public_snapshot_revision} · publication_revision=${bundle.publication_revision}`;
    if (bundle.run_mode === "SPEED") {
      renderSvgChart($("accChart"), [{ name: "ACC", color: "#2866d8", points: [] }], { title: "SYNTHETIC ACC", tooltipScope: "history", emptyMessage: "不適用：此模式未記錄 ACC。" });
      renderSvgChart($("hxChart"), [{ name: "HX", color: "#d08a20", points: [] }], { title: "SYNTHETIC HX", tooltipScope: "history", emptyMessage: "不適用：此模式未記錄 HX。" });
      $("accRows").innerHTML = `<tr><td colspan="5" class="empty-cell">NOT APPLICABLE · SPEED 未記錄 ACC · SYNTHETIC</td></tr>`;
      $("hxRows").innerHTML = `<tr><td colspan="5" class="empty-cell">NOT APPLICABLE · SPEED 未記錄 HX · SYNTHETIC</td></tr>`;
      return;
    }
    const axisMeta = [
      ["x_raw", "X raw counts", "#2866d8"],
      ["y_raw", "Y raw counts", "#1a9a8b"],
      ["z_raw", "Z raw counts", "#c06c42"]
    ];
    const accSeries = axisMeta.map(([key, name, color]) => ({
      name,
      color,
      points: acc.map((row, i) => ({
        x: row.t_read_us, y: row[key],
        breakBefore: !wrapResolved || previousIndexBreak(acc, i),
        tooltip: `ACC ${key.replace("_raw", "").toUpperCase()}=${row[key]} RAW counts · t_read_us=${row.t_read_us} · saved_record_index=${row.saved_record_index}（非 ADC sample 序號）`
      }))
    }));
    renderSvgChart($("accChart"), accSeries, {
      title: `SYNTHETIC ${bundle.public_run_id} ACC raw counts`,
      description: "ACC 保存讀出時間與三個感測器軸向原始 counts；不轉換加速度。",
      xLabel, yLabel: "RAW counts", tooltipScope: "history", tooltipIdentity
    });
    const hxSeries = [{
      name: "HX raw counts", color: "#d08a20",
      points: hx.map((row, i) => ({
        x: row.t_read_us, y: row.hx_raw,
        breakBefore: !wrapResolved || previousIndexBreak(hx, i),
        tooltip: `HX=${row.hx_raw} RAW counts · t_read_us=${row.t_read_us} · SAT=${row.sat} · saved_record_index=${row.saved_record_index}（非 ADC sample 序號）`
      }))
    }];
    renderSvgChart($("hxChart"), hxSeries, {
      title: `SYNTHETIC ${bundle.public_run_id} HX raw counts`,
      description: "HX accepted saved rows 的原始 counts；SAT 旗標保留，未校正成重量或力。",
      xLabel, yLabel: "HX RAW counts", tooltipScope: "history", tooltipIdentity
    });
    $("accRows").innerHTML = acc.length ? acc.map((row) => `<tr><td>${row.saved_record_index}</td><td>${row.t_read_us}</td><td>${row.x_raw}</td><td>${row.y_raw}</td><td>${row.z_raw}</td></tr>`).join("") : `<tr><td colspan="5" class="empty-cell">沒有 ACC rows · SYNTHETIC</td></tr>`;
    $("hxRows").innerHTML = hx.length ? hx.map((row) => `<tr><td>${row.saved_record_index}</td><td>${row.t_read_us}</td><td>${row.hx_raw}</td><td>${row.sat ? "true" : "false"}</td><td>${escapeHtml(row.record_kind)}</td></tr>`).join("") : `<tr><td colspan="5" class="empty-cell">沒有 HX rows · SYNTHETIC</td></tr>`;
    if (!wrapResolved) {
      $("accAxisCaption").textContent += " Clock wrap 未解：只顯點、不連線。";
      $("hxAxisCaption").textContent += " Clock wrap 未解：只顯點、不連線。";
    }
  }

  function renderOptical(bundle) {
    const record = bundle.streams.OPTICAL[0];
    const metricItem = bundle.analysis.find((item) => item.metric_id === "TWO_GATE_AVERAGE_SPEED");
    if (!record) {
      $("opticalSummary").textContent = "沒有 Optical 事件紀錄 · SYNTHETIC。";
      $("opticalValues").innerHTML = "";
      return;
    }
    const gate = opticalSpeedGate(bundle, record, metricItem);
    const gateSummary = gate.allowed
      ? "上游 fixture 通過結構與語義門控；顯示的速度來自合約 metric，不由前端計算。"
      : `速度不可用：${gate.reason}${record.semantic_validation !== "VALID" ? `來源語義 ${record.semantic_validation}。` : ""}`;
    $("opticalSummary").textContent = `SYNTHETIC · ${gateSummary}`;
    const metricValue = gate.allowed
      ? `${Number(metricItem.value).toFixed(6)} m/s · 兩閘區間平均速度`
      : "UNAVAILABLE · 不衍生速度";
    const values = [
      ["Upper seen / time", `${record.upper_seen} · ${record.upper_us === null ? "UNKNOWN" : `${record.upper_us} us`}`],
      ["Lower seen / time", `${record.lower_seen} · ${record.lower_us === null ? "UNKNOWN" : `${record.lower_us} us`}`],
      ["dt_us", record.dt_us === null ? "UNKNOWN" : numericText(record.dt_us)],
      ["Semantic validation", record.semantic_validation],
      ["Configured distance", record.configured_distance_mm === null ? "UNKNOWN" : `${record.configured_distance_mm} mm · 設定值`],
      ["Upstream speed metric", metricValue],
      ["Metric eligibility", metricItem ? metricItem.metric_eligibility : "UNKNOWN"],
      ["Reason", !gate.allowed ? gate.reason : record.reason_codes.length ? reasonText(record.reason_codes) : metricItem ? reasonText(metricItem.reason_codes) : "未提供"]
    ];
    $("opticalValues").innerHTML = values.map(([label, value]) => `<div class="optical-value"><span>${escapeHtml(label)} · SYNTHETIC</span><strong>${escapeHtml(value)}</strong></div>`).join("");
  }

  function downloadActiveHistory() {
    if (!activeHistory) return;
    const blob = new Blob([JSON.stringify(activeHistory, null, 2)], { type: "application/json;charset=utf-8" });
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `synthetic-${activeHistory.public_run_id}-${activeHistory.publication_revision}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    $("downloadStatus").textContent = `已準備 SYNTHETIC JSON：${link.download}`;
  }

  function init() {
    $("liveScenario").addEventListener("change", (event) => {
      stopPlayback();
      renderLive(event.target.value);
    });
    $("playDemo").addEventListener("click", startPlayback);
    $("stopDemo").addEventListener("click", stopPlayback);
    $("historySelect").addEventListener("change", (event) => requestHistory(event.target.value));
    $("downloadHistory").addEventListener("click", downloadActiveHistory);
    window.addEventListener("beforeunload", () => {
      stopPlayback();
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    });
    renderLive("unknown");
    requestHistory("");
  }

  init();
})();
