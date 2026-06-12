# ---------------- Dev image ----------------
FROM debian:trixie-slim

ENV DEBIAN_FRONTEND=noninteractive
ENV HOME=/home/root
ENV ZSH_CUSTOM=$HOME/.oh-my-zsh/custom
ENV BUN_INSTALL=$HOME/.bun
ENV PATH="$BUN_INSTALL/bin:$HOME/.rokit/bin:/workspaces/TS-UILib/node_modules/.bin:$PATH"

# ---------------- Essentials ----------------
RUN apt-get update && apt-get install -y --no-install-recommends \
      bash bash-completion zsh ca-certificates curl git sudo unzip tree docker.io \
      openssh-client procps lsof \
    && curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/* \
    && update-ca-certificates \
    && mkdir -p /home/root \
    && echo "root ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers \
    && chown -R root:root /home/root

RUN chsh -s /bin/zsh root

# ---------------- User ----------------
USER root
WORKDIR $HOME

# ---------------- Oh My Zsh + Powerlevel10k ----------------
RUN git clone --depth=1 https://github.com/ohmyzsh/ohmyzsh.git $HOME/.oh-my-zsh \
    && git clone --depth=1 https://github.com/romkatv/powerlevel10k.git $ZSH_CUSTOM/themes/powerlevel10k \
    && git clone --depth=1 https://github.com/zsh-users/zsh-autosuggestions.git $ZSH_CUSTOM/plugins/zsh-autosuggestions \
    && git clone --depth=1 https://github.com/zsh-users/zsh-syntax-highlighting.git $ZSH_CUSTOM/plugins/zsh-syntax-highlighting \
    && cp $HOME/.oh-my-zsh/templates/zshrc.zsh-template $HOME/.zshrc \
    && sed -i 's/^ZSH_THEME=.*/ZSH_THEME="powerlevel10k\/powerlevel10k"/' $HOME/.zshrc \
    && sed -i 's/^plugins=(git)/plugins=(git zsh-autosuggestions zsh-syntax-highlighting)/' $HOME/.zshrc \
    && echo '[[ -f ~/.p10k.zsh ]] && source ~/.p10k.zsh' >> $HOME/.zshrc \
    && echo 'export ZSH_DISABLE_COMPFIX=true' >> $HOME/.zshrc \
    && echo 'alias p10k="zsh -i -c '\''source ~/.p10k.zsh && p10k configure'\''"' >> $HOME/.zshrc

# Copy preconfigured .p10k.zsh
COPY --chown=root:root .devcontainer/.config/.p10k.zsh $HOME/.p10k.zsh

# ---------------- Bun ----------------
RUN curl -fsSL https://bun.sh/install | bash \
    && echo 'export PATH="$HOME/.bun/bin:$PATH"' >> $HOME/.zshrc

# ---------------- Rokit ----------------
RUN curl -fsSL https://raw.githubusercontent.com/rojo-rbx/rokit/main/scripts/install.sh | bash

# Add to PATH
ENV PATH="/home/root/.rokit/bin:${PATH}"

# ---------------- Fix Zsh paste & tab ----------------
RUN echo '# Fix paste duplication from autosuggestions' >> $HOME/.zshrc \
    && echo 'zle_bracketed_paste_start() { ZSH_AUTOSUGGEST_DISABLED=1 }' >> $HOME/.zshrc \
    && echo 'zle_bracketed_paste_end() { unset ZSH_AUTOSUGGEST_DISABLED }' >> $HOME/.zshrc \
    && echo 'zle -N zle_bracketed_paste_start' >> $HOME/.zshrc \
    && echo 'zle -N zle_bracketed_paste_end' >> $HOME/.zshrc \
    && echo '# Fix tab completion' >> $HOME/.zshrc \
    && echo 'bindkey "^I" expand-or-complete' >> $HOME/.zshrc

# ---------------- Healthcheck ----------------
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD bun --version || exit 1

# ---------------- Default shell ----------------
CMD ["zsh"]
