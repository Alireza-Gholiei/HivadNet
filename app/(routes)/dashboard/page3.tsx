export default function Dashboard() {
	const stats = [
		{
			title: "وضعیت سیستم",
			value: "عالی و پایدار",
			sub: "Ping: 24ms | Up: 99.9%",
			accent: "text-emerald-400",
			special: true,
			icon: "✦",
		},
		{
			title: "کارهای در صف",
			value: "7",
			sub: "مورد",
			accent: "text-amber-400",
			icon: "⌛",
		},
		{
			title: "کلاینت‌های اشغال",
			value: "14",
			sub: "20 /",
			accent: "text-blue-400",
			icon: "🖥️",
		},
		{
			title: "درآمد امروز (تومان)",
			value: "3,850,000",
			sub: "+12%",
			accent: "text-emerald-400",
			icon: "💼",
		},
	];

	const jobs = [
		{
			title: "پرینت رنگی پروژه پایان‌نامه",
			customer: "مشتری: سارا رحیمی - ۱۵۰ صفحه دو رو (فایل در دسکتاپ)",
			price: "185,000 T",
			status: "در حال انجام",
			urgent: true,
			icon: "PDF",
			iconStyle: "bg-pink-500/15 text-pink-400",
			border: "border-pink-500/30",
			side: "bg-rose-500",
		},
		{
			title: "ثبت‌نام لاستیک دولتی کویرتایر",
			customer: "آقای موسوی - نیاز به احراز کد پیامکی",
			price: "--:--",
			status: "منتظر مشتری",
			urgent: false,
			icon: "🌐",
			iconStyle: "bg-violet-500/15 text-violet-400",
			border: "border-white/5",
			side: "bg-transparent",
		},
	];

	return (
		<div dir="rtl" className="min-h-screen bg-[#0b0d0f] text-white">
			<div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_18%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.08),transparent_18%)]">
				<div className="flex min-h-screen flex-col xl:flex-row">
					<aside className="w-full border-b border-white/5 bg-black/20 px-5 py-6 backdrop-blur-sm xl:w-72.5 xl:border-b-0 xl:border-l">
						<div className="flex h-full flex-col justify-between gap-8">
							<div>
								<div className="mb-10 flex items-center gap-3">
									<div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400 text-2xl font-black text-black shadow-[0_0_30px_rgba(16,185,129,0.35)]">
										⚡
									</div>
									<div>
										<h1 className="text-2xl font-extrabold">پلتفرم سایپرنت</h1>
										<p className="text-sm text-zinc-400">پورتال مدیریت یکپارچه</p>
									</div>
								</div>

								<nav className="space-y-3">
									<SidebarItem title="اصلی" icon="⌂" />
									<SidebarItem title="میز کار" icon="▦" active />
									<SidebarItem title="مدیریت پرونده‌ها" icon="📄" />
									<SidebarItem title="صف پرینت" icon="🖨️" />
									<SidebarItem title="کلاینت‌ها" icon="🖥️" />
								</nav>

								<div className="mt-10 flex items-center gap-2 px-2">
									<span className="h-2.5 w-2.5 rounded-full bg-zinc-600" />
									<span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
									<span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
								</div>
							</div>

							<div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-4">
								<div>
									<div className="font-bold">ایمان قاسمی</div>
									<div className="text-sm text-zinc-400">اپراتور • آنلاین شیفت صبح</div>
								</div>
								<div className="h-12 w-12 rounded-xl bg-zinc-700" />
							</div>
						</div>
					</aside>

					<main className="flex-1 px-4 py-6 sm:px-6 xl:px-8">
						<div className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
							<div className="flex items-center gap-4">
								<div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/5 bg-white/5">
									🛰️
								</div>
								<div>
									<div className="text-sm text-zinc-400">امروز</div>
									<div className="text-lg font-bold">24 Oct, 10:45 AM</div>
								</div>
							</div>

							<div className="w-full max-w-2xl">
								<div className="relative">
									<input
										type="text"
										placeholder="جستجوی کد رهگیری، نام مشتری یا تلفن..."
										className="h-14 w-full rounded-2xl border border-white/5 bg-white/5 pr-12 pl-24 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-emerald-400/40"
									/>
									<span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">🔍</span>

									<div className="absolute left-4 top-1/2 flex -translate-y-1/2 items-center gap-2 text-xs text-zinc-400">
										<span className="rounded-lg border border-white/5 bg-black/20 px-2 py-1">
											Ctrl
										</span>
										<span className="rounded-lg border border-white/5 bg-black/20 px-2 py-1">
											K
										</span>
									</div>
								</div>
							</div>
						</div>

						<section className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-4">
							{stats.map((item) => (
								<div
									key={item.title}
									className={`relative overflow-hidden rounded-[28px] border border-white/5 bg-[#17191d] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.35)] ${
										item.special ? "bg-[linear-gradient(180deg,#17191d_0%,#10241d_100%)]" : ""
									}`}
								>
									{item.special && (
										<div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.22),transparent_35%)]" />
									)}

									<div className="relative z-10">
										<div
											className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 ${item.accent}`}
										>
											{item.icon}
										</div>

										<div className={`mb-2 font-bold ${item.accent}`}>{item.title}</div>

										{item.title === "کارهای در صف" || item.title === "کلاینت‌های اشغال" ? (
											<div className="flex items-end gap-2">
												<span className="text-5xl font-extrabold leading-none">
													{item.value}
												</span>
												<span className="mb-1 text-zinc-500">{item.sub}</span>
											</div>
										) : item.title === "درآمد امروز (تومان)" ? (
											<div className="flex items-center gap-3">
												<span className="text-4xl font-extrabold">{item.value}</span>
												<span className="rounded-lg bg-emerald-400/10 px-2 py-1 text-xs text-emerald-400">
													{item.sub}
												</span>
											</div>
										) : (
											<>
												<div className="mb-8 text-4xl font-extrabold">{item.value}</div>
												<div className="text-sm text-zinc-400">{item.sub}</div>
											</>
										)}
									</div>
								</div>
							))}
						</section>

						<section className="grid grid-cols-1 gap-8 2xl:grid-cols-12">
							<div className="2xl:col-span-7">
								<div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
									<div className="order-2 flex items-center gap-3 sm:order-1">
										<button className="rounded-2xl bg-white px-5 py-3 font-bold text-black">
											همه کارها
										</button>
										<button className="rounded-2xl border border-white/5 bg-white/5 px-5 py-3 text-zinc-300">
											در حال انجام
										</button>
									</div>

									<div className="order-1 text-right sm:order-2">
										<div className="font-bold text-emerald-400">Live •</div>
										<h2 className="text-3xl font-extrabold sm:text-4xl">گردش کار زنده</h2>
									</div>
								</div>

								<div className="space-y-5">
									{jobs.map((job) => (
										<div
											key={job.title}
											className={`relative overflow-hidden rounded-[28px] border ${job.border} bg-[#17191d] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.35)]`}
										>
											{job.urgent && (
												<div className={`absolute left-0 top-0 h-full w-1.5 ${job.side}`} />
											)}

											<div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
												<div className="flex items-center gap-4">
													<div
														className={`flex h-14 w-14 items-center justify-center rounded-2xl font-bold ${job.iconStyle}`}
													>
														{job.icon}
													</div>

													<div>
														<div className="mb-1 flex flex-wrap items-center gap-2">
															{job.urgent && (
																<span className="rounded-lg bg-rose-500 px-2 py-1 text-xs text-white">
																	فوری
																</span>
															)}
															<h3 className="text-xl font-bold sm:text-2xl">
																{job.title}
															</h3>
														</div>
														<p className="text-sm text-zinc-400">{job.customer}</p>
													</div>
												</div>

												<div className="flex flex-col items-start gap-3 xl:items-end">
													<div className="text-2xl font-extrabold sm:text-3xl">
														{job.price}
													</div>
													<div className="flex items-center gap-2">
														<button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/5 bg-white/5 text-zinc-400">
															...
														</button>
														<button
															className={`rounded-2xl px-5 py-3 font-bold ${
																job.status === "در حال انجام"
																	? "bg-amber-400 text-black"
																	: "border border-white/10 bg-white/5 text-zinc-300"
															}`}
														>
															{job.status}
														</button>
													</div>
												</div>
											</div>
										</div>
									))}

									<div className="rounded-[28px] border border-emerald-400/20 bg-emerald-950/30 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
										<div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
											<div className="flex items-center gap-4">
												<div className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-emerald-400 text-2xl text-emerald-400">
													🖥️
												</div>
												<div>
													<h3 className="text-2xl font-bold">کلاینت شماره ۰۵</h3>
													<p className="text-sm text-emerald-300/80">
														Time Elapsed: 00:45:12
													</p>
												</div>
											</div>

											<button className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-medium text-zinc-100">
												پایان و تسویه حساب
											</button>
										</div>
									</div>
								</div>
							</div>

							<div className="2xl:col-span-5">
								<div className="h-full rounded-4xl border border-white/5 bg-[#17191d] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.35)] sm:p-8">
									<div className="mb-8 flex items-center justify-between">
										<span className="h-12 w-2 rounded-full bg-emerald-400" />
										<h2 className="text-3xl font-extrabold sm:text-4xl">ثبت کار جدید</h2>
									</div>

									<form className="space-y-6">
										<div>
											<label className="mb-3 block text-sm text-zinc-400">اطلاعات مشتری</label>
											<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
												<input
													type="text"
													placeholder="نام مشتری (اختیاری)"
													className="h-14 rounded-2xl border border-white/5 bg-white/5 px-4 text-white outline-none placeholder:text-zinc-500 focus:border-emerald-400/40"
												/>
												<input
													type="text"
													placeholder="موبایل"
													className="h-14 rounded-2xl border border-white/5 bg-white/5 px-4 text-white outline-none placeholder:text-zinc-500 focus:border-emerald-400/40"
												/>
											</div>
										</div>

										<div>
											<label className="mb-3 block text-sm text-zinc-400">نوع خدمت</label>
											<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
												<button
													type="button"
													className="flex h-24 flex-col items-center justify-center gap-2 rounded-3xl border border-emerald-400 bg-emerald-400/5 text-white"
												>
													<span className="text-2xl">🖨️</span>
													<span className="font-bold">پرینت / کپی</span>
												</button>

												<button
													type="button"
													className="flex h-24 flex-col items-center justify-center gap-2 rounded-3xl border border-white/5 bg-white/5 text-zinc-300"
												>
													<span className="text-2xl">🪪</span>
													<span className="font-bold">ثبت‌نام اینترنتی</span>
												</button>
											</div>
										</div>

										<div>
											<label className="mb-3 block text-sm text-zinc-400">
												برآورد هزینه و توضیحات
											</label>
											<input
												type="text"
												placeholder="۰ تومان"
												className="mb-4 h-14 w-full rounded-2xl border border-white/5 bg-white/5 px-4 text-white outline-none placeholder:text-zinc-500 focus:border-emerald-400/40"
											/>
											<textarea
												rows={5}
												placeholder="توضیحات سفارش..."
												className="w-full resize-none rounded-2xl border border-white/5 bg-white/5 p-4 text-white outline-none placeholder:text-zinc-500 focus:border-emerald-400/40"
											/>
										</div>

										<button
											type="submit"
											className="h-14 w-full rounded-2xl bg-emerald-400 text-lg font-extrabold text-black transition hover:opacity-90"
										>
											ثبت سفارش
										</button>
									</form>
								</div>
							</div>
						</section>
					</main>
				</div>
			</div>
		</div>
	);
}

function SidebarItem({ title, icon, active = false }: { title: string; icon: string; active?: boolean }) {
	return (
		<button
			className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 transition ${
				active
					? "border border-white/5 bg-white/5 font-bold text-emerald-400 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]"
					: "text-zinc-300 hover:bg-white/5 hover:text-white"
			}`}
		>
			<span>{title}</span>
			<span>{icon}</span>
		</button>
	);
}
