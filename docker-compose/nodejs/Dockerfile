FROM archlinux

RUN pacman -Sy --noconfirm
RUN pacman -Sy archlinux-keyring --noconfirm
RUN pacman-key --init
RUN pacman-key --populate archlinux
RUN pacman -Syu --noconfirm

RUN pacman -S nodejs-lts-iron --noconfirm
RUN pacman -S yarn --noconfirm

ADD runner.sh /runner.sh
RUN chmod +x /runner.sh
CMD ["./runner.sh"]
