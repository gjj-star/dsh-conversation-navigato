window.__ModuleLoader__.load({
	id: "dsh-conversation-navigator",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		const React = require("react");
		const { Button, Tooltip, IconCloseOutline16 } = require("@deepseek-ai/dsh-client-ui-primitives");

		/* ---------- custom icons (DSH outline style, unique to this panel) ---------- */
		function ToggleIcon() {
			return React.createElement("svg", {
				viewBox: "0 0 14 14", width: 14, height: 14, fill: "none",
				stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round",
				"aria-hidden": true,
			},
				React.createElement("circle", { cx: 3.5, cy: 3, r: 1, fill: "currentColor", stroke: "none" }),
				React.createElement("path", { d: "M6.5 3H12" }),
				React.createElement("circle", { cx: 3.5, cy: 7, r: 1, fill: "currentColor", stroke: "none" }),
				React.createElement("path", { d: "M6.5 7H12" }),
				React.createElement("circle", { cx: 3.5, cy: 11, r: 1, fill: "currentColor", stroke: "none" }),
				React.createElement("path", { d: "M6.5 11H12" }),
			);
		}
		function LoadEarlierIcon() {
			return React.createElement("svg", {
				viewBox: "0 0 14 14", width: 14, height: 14, fill: "none",
				stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round",
				"aria-hidden": true,
			},
				React.createElement("path", { d: "M7 11V5M4 7.5l3-3 3 3" }),
				React.createElement("line", { x1: 2, y1: 3, x2: 12, y2: 3 }),
			);
		}
		function LoadAllIcon() {
			return React.createElement("svg", {
				viewBox: "0 0 14 14", width: 14, height: 14, fill: "none",
				stroke: "currentColor", strokeWidth: 1.3, strokeLinecap: "round", strokeLinejoin: "round",
				"aria-hidden": true,
			},
				React.createElement("path", { d: "M7 2l5 3-5 3-5-3 5-3z" }),
				React.createElement("path", { d: "M2 5v3l5 3 5-3V5" }),
			);
		}
		function JumpLatestIcon() {
			return React.createElement("svg", {
				viewBox: "0 0 14 14", width: 14, height: 14, fill: "none",
				stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round",
				"aria-hidden": true,
			},
				React.createElement("path", { d: "M7 3V9M4 7l3 3 3-3" }),
				React.createElement("line", { x1: 2, y1: 11, x2: 12, y2: 11 }),
			);
		}
		function CollapseAllIcon() {
			return React.createElement("svg", {
				viewBox: "0 0 14 14", width: 14, height: 14, fill: "none",
				stroke: "currentColor", strokeWidth: 1.2, strokeLinecap: "round",
				"aria-hidden": true,
			},
				React.createElement("line", { x1: 2.5, y1: 2, x2: 11.5, y2: 2 }),
				React.createElement("line", { x1: 2.5, y1: 5, x2: 11.5, y2: 5 }),
				React.createElement("line", { x1: 2.5, y1: 8, x2: 11.5, y2: 8 }),
				React.createElement("line", { x1: 2.5, y1: 11, x2: 11.5, y2: 11 }),
			);
		}

		/* ---------- own stylesheet (static packages have no styles builtin) ---------- */
		const CSS = `
.cnvnav-panel {
  position: fixed; z-index: 9999; width: 288px;
  display: flex; flex-direction: column;
  pointer-events: auto;
  background: var(--dsw-alias-bg-overlay, #fff);
  border: 1px solid var(--dsw-alias-border-l1, rgba(128,128,128,.35));
  border-radius: 12px;
  box-shadow: 0 16px 48px rgba(0,0,0,.22);
  font-family: system-ui, -apple-system, 'Segoe UI', 'Microsoft YaHei', sans-serif;
  font-size: 12px;
  color: var(--dsw-alias-label-primary, #222);
  overflow: hidden;
}
.cnvnav-head {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 12px;
  border-bottom: 1px solid var(--dsw-alias-border-l1, rgba(128,128,128,.35));
}
.cnvnav-title { font-family: var(--dsw-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', sans-serif); font-size: 18px; font-weight: 700; line-height: 24px; }
.cnvnav-count { color: var(--dsw-alias-label-secondary, #888); font-size: 11px; }
.cnvnav-close { margin-left: auto; }
.cnvnav-list {
  overflow-y: auto; padding: 6px; min-height: 0;
  display: flex; flex-direction: column; gap: 2px;
  scrollbar-width: thin;
}
.cnvnav-group { display: flex; flex-direction: column; gap: 2px; margin-bottom: 2px; }
.cnvnav-group-row {
  display: flex; align-items: stretch;
  border-radius: 8px; overflow: hidden;
}
.cnvnav-group-row:hover { background: var(--dsw-alias-bg-layer-2, rgba(128,128,128,.12)); }
.cnvnav-group-row-active { background: var(--dsw-alias-bg-layer-2, rgba(128,128,128,.12)); }
.cnvnav-group-row-active .cnvnav-group-title { color: var(--dsw-alias-brand-primary, #4f46e5); }
.cnvnav-group-head-wrap { flex: 1; min-width: 0; display: flex; }
.cnvnav-group-head {
  width: 100%;
  display: flex; align-items: baseline; gap: 6px; text-align: left;
  border: none; background: transparent; cursor: pointer;
  padding: 5px 0 5px 8px;
  color: var(--dsw-alias-label-primary, #222);
}
.cnvnav-group-title { font-family: var(--dsw-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', sans-serif); font-size: 16px; font-weight: 700; line-height: 22px; white-space: nowrap; }
.cnvnav-group-sub {
  color: var(--dsw-alias-label-secondary, #888);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  flex: 1; min-width: 0;
}
.cnvnav-chevron-wrap { flex: none; display: flex; }
.cnvnav-chevron {
  min-width: 30px; width: 100%;
  display: flex; align-items: center; justify-content: center;
  border: none; background: transparent; cursor: pointer;
  color: var(--dsw-alias-label-secondary, #888);
  font-size: 11px; line-height: 1; padding: 0 8px;
  white-space: nowrap;
}
.cnvnav-chevron:hover { color: var(--dsw-alias-brand-primary, #4f46e5); background: var(--dsw-alias-bg-layer-2, rgba(128,128,128,.12)); }
.cnvnav-item {
  display: flex; align-items: center; gap: 8px; width: 100%; text-align: left;
  border: none; background: transparent; cursor: pointer;
  padding: 5px 8px 5px 22px; border-radius: 8px; position: relative;
  color: var(--dsw-alias-label-primary, #222);
}
.cnvnav-item:hover { background: var(--dsw-alias-bg-layer-2, rgba(128,128,128,.12)); }
.cnvnav-item-active { background: var(--dsw-alias-bg-layer-2, rgba(128,128,128,.12)); }
.cnvnav-item-active::before {
  content: ''; position: absolute; left: 6px; top: 6px; bottom: 6px;
  width: 3px; border-radius: 2px;
  background: var(--dsw-alias-brand-primary, #4f46e5);
}
.cnvnav-badge {
  flex: none; min-width: 36px; box-sizing: border-box;
  display: inline-flex; align-items: center; justify-content: center;
  height: 19px; padding: 0 5px; border-radius: 4px;
  font-size: 10px; font-weight: 650; line-height: 1;
  letter-spacing: .035em; white-space: nowrap;
}
.cnvnav-badge-traj-user { color: var(--dsw-alias-state-business-primary, #4f46e5); background: var(--dsw-alias-state-business-tertiary, rgba(79,70,229,.14)); }
.cnvnav-badge-traj-context { color: color-mix(in srgb, var(--dsw-alias-state-success-primary, #0e9f6e) 68%, var(--dsw-alias-label-secondary, #888)); background: var(--dsw-alias-state-success-tertiary, rgba(14,159,110,.14)); }
.cnvnav-badge-traj-assistant { color: color-mix(in srgb, var(--dsw-alias-brand-primary-new-colorprimary-new-color, #7c3aed) 60%, var(--dsw-alias-state-error-secondary, #b91c1c)); background: color-mix(in srgb, color-mix(in srgb, var(--dsw-alias-brand-primary-new-colorprimary-new-color, #7c3aed) 55%, var(--dsw-alias-state-error-secondary, #b91c1c)) 15%, var(--dsw-alias-bg-layer-1, transparent)); }
.cnvnav-badge-traj-tool { color: var(--dsw-alias-state-warn-label, #b45309); background: var(--dsw-alias-state-warn-tertiary, rgba(180,83,9,.14)); }
.cnvnav-badge-traj-compacted { color: var(--dsw-alias-label-secondary, #888); background: var(--dsw-alias-bg-module-platform, rgba(128,128,128,.12)); }
.cnvnav-badge-other-command { color: #1d4ed8; background: rgba(29,78,216,.13); }
.cnvnav-badge-other-error { color: var(--dsw-alias-state-error-primary, #dc2626); background: color-mix(in srgb, var(--dsw-alias-state-error-primary, #dc2626) 14%, transparent); }
.cnvnav-badge-other-retry { color: #ea580c; background: rgba(234,88,12,.14); }
.cnvnav-badge-other-neutral { color: var(--dsw-alias-label-secondary, #888); background: var(--dsw-alias-bg-module-platform, rgba(128,128,128,.12)); }
.cnvnav-item-preview {
  flex: 1; min-width: 0; display: block;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  color: var(--dsw-alias-label-secondary, #888);
}
.cnvnav-item-time {
  flex: none; color: var(--dsw-alias-label-secondary, #888); font-size: 10px; opacity: .8;
}
.cnvnav-empty { padding: 18px 10px; text-align: center; color: var(--dsw-alias-label-secondary, #888); }
.cnvnav-topbar { display: flex; gap: 6px; margin: 6px 6px 0; }
.cnvnav-footer { display: flex; gap: 6px; margin: 0 6px 6px; }
.cnvnav-bar-btn { flex: 1; display: block; }
.cnvnav-bar-fill { width: 100%; }
`;

		function apply(ctx) {
			const slots = ctx.get("slots");
			if (slots === undefined) return;
			const timer = ctx.get("timer");
			const sessions = ctx.get("sessions");

			/* own stylesheet with fiber-scoped cleanup */
			const styleEl = document.createElement("style");
			styleEl.setAttribute("data-dsh-cnvnav", "");
			styleEl.textContent = CSS;
			document.head.appendChild(styleEl);
			ctx.effect(() => () => styleEl.remove());

			/* ---------- shared store (toggle button + overlay panel) ---------- */
			let state = { open: true, sessionId: null, outline: null, activeKey: null, expanded: {}, hasMore: false, loadingOlder: false, loadingAll: false };
			const listeners = new Set();
			function setState(patch) {
				state = Object.assign({}, state, patch);
				listeners.forEach((fn) => { try { fn(); } catch (err) { console.error(err); } });
			}
			function subscribe(fn) { listeners.add(fn); return () => { listeners.delete(fn); }; }
			function useStore() {
				const [snap, setSnap] = React.useState(state);
				React.useEffect(() => subscribe(() => setSnap(state)), []);
				return snap;
			}

			/* ---------- history paging ---------- */
			let loadingAll = false;
			function loadOlderPage() {
				if (sessions === undefined) return;
				const sid = state.sessionId;
				if (sid === null) return;
				const binding = sessions.binding(sid);
				if (binding === undefined) return;
				binding.session.loadOlder().catch((err) => console.error(err));
			}
			async function loadAllPages() {
				if (sessions === undefined || loadingAll) return;
				const sid = state.sessionId;
				if (sid === null) return;
				const binding = sessions.binding(sid);
				if (binding === undefined) return;
				loadingAll = true;
				setState({ loadingAll: true });
				try {
					let guard = 0;
					while (binding.session.getSnapshot().hasMore && guard < 500) {
						await binding.session.loadOlder();
						guard += 1;
					}
				} catch (err) {
					console.error(err);
				} finally {
					loadingAll = false;
					setState({ loadingAll: false });
				}
			}

			/* ---------- outline derivation from ConversationSnapshot ---------- */
			const KIND_META = {
				"user": { label: "你", cls: "traj-user" },
				"steering": { label: "插话", cls: "traj-user" },
				"context": { label: "上下文", cls: "traj-context" },
				"assistant-step": { label: "助手", cls: "traj-assistant" },
				"tool-call": { label: "工具", cls: "traj-tool" },
				"command": { label: "命令", cls: "other-command" },
				"compaction": { label: "压缩", cls: "traj-compacted" },
				"manual-compaction": { label: "压缩", cls: "traj-compacted" },
				"turn-error": { label: "出错", cls: "other-error" },
				"turn-max-tokens": { label: "截断", cls: "other-error" },
				"model-retry": { label: "重试", cls: "other-retry" },
				"workflow-run": { label: "流程", cls: "other-neutral" },
				"unknown": { label: "其他", cls: "other-neutral" },
			};
			function firstText(blocks) {
				if (!Array.isArray(blocks)) return null;
				for (const b of blocks) {
					if (!b || typeof b !== "object") continue;
					if ((b.type === "text" || b.kind === "text") && typeof b.text === "string" && b.text.trim() !== "") return b.text;
				}
				return null;
			}
			function previewFor(node) {
				const d = node && node.data;
				if (!d || typeof d !== "object") return null;
				switch (node.kind) {
					case "user":
					case "steering":
					case "context":
						return firstText(d.content);
					case "assistant-step": {
						const text = firstText(d.blocks);
						if (text !== null) return text;
						if (Array.isArray(d.blocks) && d.blocks.some((b) => b && b.kind === "tool-call")) return "调用工具";
						return d.status === "running" ? "进行中…" : null;
					}
					case "tool-call": {
						const root = d.root;
						if (!root || typeof root !== "object") return null;
						if (root.isError === true) return "执行失败";
						const name = typeof root.name === "string" ? root.name
							: (root.call && typeof root.call.name === "string" ? root.call.name : null);
						return name;
					}
					case "command":
						return typeof d.name === "string" ? d.name + (typeof d.args === "string" && d.args !== "" ? " " + d.args : "") : null;
					case "compaction":
						return typeof d.summary === "string" ? d.summary : "上下文已压缩";
					case "manual-compaction": {
						const c = d.compaction;
						if (c && typeof c.summary === "string") return c.summary;
						return "手动压缩";
					}
					case "turn-error":
						return typeof d.message === "string" ? d.message : "本轮出错";
					case "turn-max-tokens":
						return "达到输出上限";
					case "model-retry": {
						const n = Array.isArray(d.attempts) ? d.attempts.length : 0;
						return "自动重试" + (n > 0 ? " ×" + n : "…");
					}
					case "unknown":
						return typeof d.type === "string" ? "未知事件 " + d.type : "未知事件";
					default:
						return null;
				}
			}
			function timeOf(node) {
				const d = node && node.data;
				if (!d || typeof d !== "object") return null;
				const t = typeof d.time === "number" ? d.time
					: (d.root && typeof d.root.time === "number" ? d.root.time : null);
				return t;
			}
			function fmtTime(ms) {
				if (typeof ms !== "number" || !isFinite(ms)) return "";
				const d = new Date(ms);
				const h = d.getHours();
				const m = d.getMinutes();
				return (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m);
			}
			function turnOf(node) {
				const loc = node && node.location;
				if (!loc) return null;
				if (loc.kind === "step" || loc.kind === "turn") return loc.turn.turn;
				return null;
			}
			function truncate(text, max) {
				if (typeof text !== "string") return "";
				if (text.length <= max) return text;
				return text.slice(0, max) + "…";
			}
			function deriveOutline(snap) {
				const empty = { groups: [], count: 0, byKey: {} };
				if (snap === null || snap === undefined) return empty;
				const order = snap.chat && snap.chat.order;
				const nodes = snap.chat && snap.chat.nodes;
				if (!Array.isArray(order) || nodes === undefined) return empty;
				const groups = [];
				const byKey = {};
				let current = null;
				let count = 0;
				for (const key of order) {
					const node = nodes.get(key);
					if (node === undefined) continue;
					const meta = KIND_META[node.kind] || KIND_META.unknown;
					const item = {
						key: node.key,
						kind: node.kind,
						label: meta.label,
						cls: meta.cls,
						preview: previewFor(node),
						time: fmtTime(timeOf(node)),
					};
					const turn = turnOf(node);
					if (turn === null) {
						groups.push({ turn: null, items: [item], gid: "x" + groups.length });
						count += 1;
						current = null;
						continue;
					}
					if (current === null || current.turn !== turn) {
						current = { turn: turn, items: [], gid: "t" + turn };
						groups.push(current);
					}
					current.items.push(item);
					count += 1;
				}
				for (const g of groups) {
					const first = g.items[0];
					if (g.turn === null) {
						g.title = first.label;
						g.subtitle = truncate(first.preview || "", 60);
						g.headKey = first.key;
						g.headIsUser = false;
					} else {
						g.title = "第 " + g.turn + " 轮";
						const head = first.kind === "user" ? first : null;
						g.headKey = head ? head.key : first.key;
						g.headIsUser = head !== null;
						g.subtitle = truncate((head ? head.preview : first.preview) || "", 60);
					}
					for (const it of g.items) byKey[it.key] = g.gid;
				}
				return { groups: groups, count: count, byKey: byKey };
			}
			let cacheKey = null;
			let cacheValue = null;
			function selectOutline(snap) {
				if (snap !== cacheKey) {
					cacheKey = snap;
					cacheValue = deriveOutline(snap);
				}
				return cacheValue;
			}

			/* ---------- DOM helpers: jump + position tracking ---------- */
			function findAnchor(key) {
				const rows = document.querySelectorAll("[data-chat-anchor-key]");
				for (const row of rows) {
					if (row.getAttribute("data-chat-anchor-key") === key) return row;
				}
				return null;
			}
			let lastActive = null;
			function jumpTo(key) {
				try {
					const el = findAnchor(key);
					if (el === null) return false;
					el.scrollIntoView({ behavior: "smooth", block: "start" });
					lastActive = key;
					setState({ activeKey: key });
					return true;
				} catch (err) {
					console.error(err);
					return false;
				}
			}
			function computeActiveKey() {
				try {
					const scrollport = document.querySelector("[data-conversation-scroll]");
					if (scrollport === null) return null;
					const vp = scrollport.getBoundingClientRect();
					const rows = document.querySelectorAll("[data-chat-anchor-key]");
					let found = null;
					for (const row of rows) {
						const rect = row.getBoundingClientRect();
						if (rect.bottom > vp.top) { found = row; break; }
					}
					if (found === null && rows.length > 0) found = rows[rows.length - 1];
					return found === null ? null : found.getAttribute("data-chat-anchor-key");
				} catch (err) {
					console.error(err);
					return null;
				}
			}

			let panelEl = null;
			let listEl = null;
			const itemEls = {};
			const groupEls = {};

			/* ---------- header toggle button ---------- */
			function ToggleButton(props) {
				const snap = useStore();
				const outline = props.useSession(selectOutline);
				const hasMore = props.useSession((s) => s.hasMore);
				const loadingOlder = props.useSession((s) => s.loadingOlder);
				React.useEffect(() => {
					setState({ sessionId: props.sessionId, outline: outline, hasMore: hasMore, loadingOlder: loadingOlder });
				}, [outline, props.sessionId, hasMore, loadingOlder]);
				React.useEffect(() => {
					if (state.sessionId !== null && state.sessionId !== props.sessionId) {
						lastActive = null;
						setState({ activeKey: null, expanded: {} });
					}
				}, [props.sessionId]);
				return React.createElement(Tooltip, {
					label: snap.open ? "收起会话导航" : "打开会话导航",
					side: "bottom",
					delayMs: 500,
				},
					React.createElement("span", null,
						React.createElement(Button, {
							variant: snap.open ? "primary" : "ghost",
							size: "sm",
							icon: React.createElement(ToggleIcon),
							"aria-pressed": snap.open,
							onClick: () => setState({ open: !snap.open }),
						}, "导航"),
					),
				);
			}

			/* ---------- floating navigator panel ---------- */
			function Panel() {
				const snap = useStore();

				React.useEffect(() => {
					if (!snap.open) return;
					function place() {
						const panel = panelEl;
						if (panel === null) return;
						const vw = document.documentElement.clientWidth || 1000;
						const vh = document.documentElement.clientHeight || 800;
						const sp = document.querySelector("[data-conversation-scroll]");
						const rect = sp !== null ? sp.getBoundingClientRect() : { top: 60, height: vh - 90 };
						const width = 288;
						const left = Math.max(8, vw - width - 12);
						panel.style.left = Math.round(left) + "px";
						panel.style.top = Math.max(8, Math.round(rect.top + 8)) + "px";
						panel.style.maxHeight = Math.round(Math.min(rect.height - 24, vh - 40)) + "px";
					}
					place();
					window.addEventListener("resize", place);
					return () => window.removeEventListener("resize", place);
				}, [snap.open]);

				React.useEffect(() => {
					if (!snap.open) return;
					const run = () => {
						const key = computeActiveKey();
						if (key !== lastActive) {
							lastActive = key;
							setState({ activeKey: key });
						}
					};
					const update = timer !== undefined ? timer.throttle(run, 120) : run;
					document.addEventListener("scroll", update, true);
					window.addEventListener("resize", update);
					run();
					return () => {
						document.removeEventListener("scroll", update, true);
						window.removeEventListener("resize", update);
						if (timer !== undefined && typeof update.dispose === "function") update.dispose();
					};
				}, [snap.open]);

				React.useEffect(() => {
					if (!snap.open || snap.activeKey === null) return;
					let target = itemEls[snap.activeKey];
					if (target === undefined || target === null) {
						const gid = snap.outline !== null ? snap.outline.byKey[snap.activeKey] : undefined;
						if (gid !== undefined) target = groupEls[gid];
					}
					const list = listEl;
					if (target !== undefined && target !== null && list !== null) {
						const lr = list.getBoundingClientRect();
						const er = target.getBoundingClientRect();
						const rel = er.top - lr.top + list.scrollTop;
						if (rel < list.scrollTop || rel + er.height > list.scrollTop + list.clientHeight) {
							list.scrollTop = Math.max(0, rel - list.clientHeight / 2);
						}
					}
				}, [snap.open, snap.activeKey]);

				if (!snap.open) return null;

				const groups = snap.outline !== null ? snap.outline.groups : [];
				const count = snap.outline !== null ? snap.outline.count : 0;

				const groupNodes = groups.map((g) => {
					const expanded = snap.expanded[g.gid] === true;
					const isTurnGroup = g.turn !== null;
					const stepItems = isTurnGroup ? (g.headIsUser ? g.items.slice(1) : g.items) : [];
					const hasSteps = stepItems.length > 0;
					const groupActive = g.items.some((it) => it.key === snap.activeKey);
					return React.createElement("div", { key: g.gid, className: "cnvnav-group" },
						React.createElement("div", {
							ref: (el) => { groupEls[g.gid] = el; },
							className: "cnvnav-group-row" + (groupActive ? " cnvnav-group-row-active" : ""),
						},
							React.createElement(Tooltip, {
								label: "跳转到此位置",
								side: "top",
								delayMs: 500,
							},
								React.createElement("span", { className: "cnvnav-group-head-wrap" },
									React.createElement("button", {
										type: "button",
										className: "cnvnav-group-head",
										onClick: () => jumpTo(g.headKey),
									},
										React.createElement("span", { className: "cnvnav-group-title" }, g.title),
										g.subtitle !== ""
											? React.createElement("span", { className: "cnvnav-group-sub" }, g.subtitle)
											: null,
									),
								),
							),
							hasSteps
								? React.createElement(Tooltip, {
									label: expanded ? "折叠步次" : "展开步次",
									side: "top",
									delayMs: 500,
								},
									React.createElement("span", { className: "cnvnav-chevron-wrap" },
										React.createElement("button", {
											type: "button",
											className: "cnvnav-chevron",
											"aria-expanded": expanded,
											onClick: (e) => {
												e.stopPropagation();
												setState({ expanded: Object.assign({}, state.expanded, { [g.gid]: !expanded }) });
											},
										},
											expanded ? "▾" : "▸ " + stepItems.length,
										),
									),
								)
								: null,
						),
						expanded && hasSteps
							? stepItems.map((item) =>
								React.createElement("button", {
									key: item.key,
									type: "button",
									ref: (el) => { itemEls[item.key] = el; },
									className: "cnvnav-item" + (item.key === snap.activeKey ? " cnvnav-item-active" : ""),
									onClick: () => jumpTo(item.key),
								},
									React.createElement("span", { className: "cnvnav-badge cnvnav-badge-" + item.cls }, item.label),
									item.preview !== null && item.preview !== ""
										? React.createElement("span", { className: "cnvnav-item-preview" }, item.preview)
										: null,
									item.time !== ""
										? React.createElement("span", { className: "cnvnav-item-time" }, item.time)
										: null,
								),
							)
							: null,
					);
				});

				return React.createElement("div", {
					ref: (el) => { panelEl = el; },
					className: "cnvnav-panel",
					role: "complementary",
					"aria-label": "会话导航",
				},
					React.createElement("div", { className: "cnvnav-head" },
						React.createElement("span", { className: "cnvnav-title" }, "会话导航"),
						React.createElement("span", { className: "cnvnav-count" }, String(count) + " 条"),
						React.createElement(Tooltip, {
							label: "收起面板",
							side: "bottom",
							delayMs: 500,
						},
							React.createElement("span", { className: "cnvnav-close" },
								React.createElement(Button, {
									variant: "ghost",
									size: "sm",
									icon: React.createElement(IconCloseOutline16, { size: 14 }),
									onClick: () => setState({ open: false }),
								}),
							),
						),
					),
					React.createElement("div", { className: "cnvnav-topbar" },
						React.createElement(Tooltip, {
							label: "加载更早的一批轮次",
							side: "bottom",
							delayMs: 500,
							disabled: !snap.hasMore || snap.loadingOlder,
						},
							React.createElement("span", { className: "cnvnav-bar-btn" },
								React.createElement(Button, {
									variant: "ghost",
									size: "sm",
									className: "cnvnav-bar-fill",
									icon: React.createElement(LoadEarlierIcon),
									disabled: !snap.hasMore || snap.loadingOlder,
									onClick: () => loadOlderPage(),
								}, "加载更早"),
							),
						),
						React.createElement(Tooltip, {
							label: "加载全部历史轮次",
							side: "bottom",
							delayMs: 500,
							disabled: !snap.hasMore || snap.loadingOlder || snap.loadingAll,
						},
							React.createElement("span", { className: "cnvnav-bar-btn" },
								React.createElement(Button, {
									variant: "ghost",
									size: "sm",
									className: "cnvnav-bar-fill",
									icon: React.createElement(LoadAllIcon),
									disabled: !snap.hasMore || snap.loadingOlder || snap.loadingAll,
									onClick: () => loadAllPages(),
								}, "加载全部"),
							),
						),
					),
					React.createElement("div", {
						ref: (el) => { listEl = el; },
						className: "cnvnav-list",
					},
						groups.length === 0
							? React.createElement("div", { className: "cnvnav-empty" }, "当前会话暂无对话节点")
							: groupNodes,
					),
					React.createElement("div", { className: "cnvnav-footer" },
						React.createElement(Tooltip, {
							label: "回到对话最新位置",
							side: "top",
							delayMs: 500,
						},
							React.createElement("span", { className: "cnvnav-bar-btn" },
								React.createElement(Button, {
									variant: "ghost",
									size: "sm",
									className: "cnvnav-bar-fill",
									icon: React.createElement(JumpLatestIcon),
									onClick: () => {
										const gs = snap.outline !== null ? snap.outline.groups : [];
										if (gs.length === 0) return;
										const lastGroup = gs[gs.length - 1];
										const lastItem = lastGroup.items[lastGroup.items.length - 1];
										if (lastItem !== undefined) jumpTo(lastItem.key);
									},
								}, "回到最新"),
							),
						),
						React.createElement(Tooltip, {
							label: "折叠所有已展开的轮次",
							side: "top",
							delayMs: 500,
						},
							React.createElement("span", { className: "cnvnav-bar-btn" },
								React.createElement(Button, {
									variant: "ghost",
									size: "sm",
									className: "cnvnav-bar-fill",
									icon: React.createElement(CollapseAllIcon),
									onClick: () => setState({ expanded: {} }),
								}, "全部折叠"),
							),
						),
					),
				);
			}

			/* ---------- register ---------- */
			slots.inject("conversation.session.header.utilities", () => slots.register(
				{ name: "conversation.session.header.utilities", id: "conversation-navigator-toggle", order: 20, label: () => "会话导航" },
				(props) => React.createElement(ToggleButton, props),
			));
			slots.inject("shell.overlay", () => slots.register(
				{ name: "shell.overlay", id: "conversation-navigator-panel", order: 10, label: () => "会话导航" },
				() => React.createElement(Panel),
			));
		}

		const inject = ["slots", "sessions"];
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
